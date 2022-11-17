const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

const { JWT_SECRET } = require('./utils/config')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return Book.find({ genres: { $in: [ args.genre ]}}).populate('author')
      }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => {
      const books = await Book.find({}).populate('author')
      const authors = await Author.find({})
      return authors.map(a => ({
        name: a.name,
        born: a.born,
        id: a._id,
        bookCount: books.filter(b => b.author.name === a.name).length
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let a = await Author.findOne({ name: args.author })
      if (!a) {
        a = new Author({ name: args.author })
        await a.save()
      }
      const book = new Book({ ...args, author: a._id })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      const addedBook = {
        title: book.title,
        published: book.published,
        genres: book.genres,
        id: book._id,
        author: a
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: addedBook })
      return addedBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers
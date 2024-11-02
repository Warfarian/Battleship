module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
      // Mock static assets
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/__mocks__/fileMock.js',
      // Mock stylesheets
      '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
      // Add shadcn UI component mapping if needed
      '@/components/ui/(.*)': '<rootDir>/__mocks__/uiMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
      '^.+\\.js$': 'babel-jest'
  }
};
# Contributing to use-quiz

Thank you for your interest in contributing to use-quiz! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/use-quiz.git
   cd use-quiz
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow the project's coding standards

3. Run the development build:
   ```bash
   pnpm dev
   ```

4. Run tests:
   ```bash
   pnpm test
   ```

5. Run linting:
   ```bash
   pnpm lint
   ```

6. Format code:
   ```bash
   pnpm format
   ```

7. Build the library:
   ```bash
   pnpm build
   ```

## Testing

We use Vitest for testing. Please ensure:

- All new features have corresponding tests
- Tests cover both happy path and edge cases
- Test coverage doesn't decrease
- Run `pnpm test:coverage` to check coverage

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use Prettier for formatting (configured in `.prettierrc`)
- Use ESLint for linting (configured in `.eslintrc.json`)
- Write meaningful commit messages

## Pull Request Process

1. Ensure all tests pass
2. Ensure code is properly formatted and linted
3. Update documentation if needed
4. Add tests for new functionality
5. Update the README if you add new features
6. Submit a pull request with a clear description

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment information (Node.js version, browser, etc.)

## Feature Requests

For feature requests, please:

- Check existing issues first
- Provide a clear description of the feature
- Explain the use case and benefits
- Consider if it fits the library's scope

## License

By contributing to use-quiz, you agree that your contributions will be licensed under the MIT License.

# diffl - File Comparison Tool
**diffl** is a web application designed to help users compare files by highlighting differences in a clear, intuitive manner. The tool is optimized to work entirely in the browser, leveraging in-memory processing to provide fast, serverless file parsing and comparison.

## Features
- **File Comparison:** Compare two files and see the differences in detail.
- **Multi-Format Support:** Input via pasted text as well as file uploads for PDFs, plain text (txt), and Markdown (md) files.
- **Diff Presentation:** Two distinct diff views:
  - **Git-Style Diff:** A traditional, line-by-line diff format similar to what is seen in version control systems.
  - **List of Changes:** A condensed format that shows only the changes.
- **Statistical Insights:** Detailed reading and statistical data for each file, including:
  - Reading time
  - Total characters
  - Word count
- **Difference Metrics:** Numerical data related to the differences, such as:
  - Number of lines changed
  - Number of characters that differ
- **Client-Side Processing:** All diff and file parsing functionality runs client-side, ensuring the app runs serverless using in-memory principles.

## Getting Started
### Prerequisites
- Node.js 18.0.0 or higher
- pnpm (recommended) or npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/zenatron/diffl.git
   cd diffl
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production
```bash
pnpm build
```

## Technologies Used
- **Next.js 15:** React framework for server-rendered applications
- **TypeScript:** For type safety and improved developer experience
- **Tailwind CSS:** For styling
- **PDF.js:** For parsing PDF files
- **diff:** For comparing text files

## License
This project is licensed under the MIT License - see the LICENSE file for details.
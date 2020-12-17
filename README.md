# PDFix SDK Wasm example Angular
Example project demonstrating how to use PDFix SDK WebAssembly build in Angular. The PDFix SDK Wasm is implemented in this Angular project using a Web Worker. Web Workers are a simple means for web content to run scripts in background threads. The worker thread can perform tasks without interfering with the user interface. [See "Using Web Workers"](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## Prerequisites
### All platforms
- Node.js: Download and follow installation instructions: https://nodejs.org/en/download/
- Angular CLI: `npm install -g @angular/cli`

## Download
Clone the repository:  
`git clone https://github.com/pdfix/pdfix_sdk_example_angular.git`

## Run the example
- Run `./pdfix-sdk-example-angular/configure.sh` to get the latest PDFix Wasm package and to install dependent npm packages
- Serve the Angular project: `ng serve`
- Navigate to `http://localhost:4200/` or serve with --open flag: `ng serve --open`

## Example description
From a rough point of view, the example demonstrates the page rendering of a sample PDF document. Upon opening the served Angular App the PDFix SDK Wasm is loaded in the background thread - the Web Worker, then a sample PDF document is opened, the document pages information is retrieved and when ready, the first document page is rendered with options to render other pages.

### Project structure
The project structure tree below contains relevant items for the example description.

```
src    
│
└───app
│   │   app.component.html      // The root component template
│   │   app.component.ts        // The root component TypeScript
│   │   app.module.ts           // Imports the PdfixService
│   │
│   └───interfaces              // Example interfaces
│   │   │   pv-page-properties.ts
│   │   │   pv-page-render-params.ts
│   │   │   ...
│   │
│   └───service                 // Creates and communicated with the Worker
│   │   │   pdfix.service.ts
│   │
│   └───worker                  // The Web Worker with Wasm loaded
│       │   pdfix-wasm-worker.worker.ts
│       │
│       └───import              // Sample codes using the PDFix SDK Wasm
│           │   pdfGetPageProperties.js
│           │   pdfOpenDoc.js
│           │   pdfRenderPage.js
│           │   pdfToHtml.js
│           │   utils.js
│   
└───assets
    │
    └───pdf                     // Sample PDF document
    │   │   test.pdf
    │
    └───pdfix                   // The PDFix SDK Wasm package
        │   pdfix.js
        │   Pdfix.idl
        │   pdfix_wasm.js
        │   pdfix_wasm.wasm
        │   pdfix_wasm.worker.js
```

## Have a question? Need help?
Let us know and we’ll get back to you. Write us to support@pdfix.net or fill the
[contact form](https://pdfix.net/support/).
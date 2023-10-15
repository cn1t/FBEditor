document.addEventListener('DOMContentLoaded', (event) => {
  highlightAllCode();
});

function highlightAllCode() {
  const codeDiv = document.getElementById("yourcode");

  hljs.highlightBlock(codeDiv);
}

// Output functions are configurable. This one just appends some text to a pre element.
function outf(text) {
  var mypre = document.getElementById("output");
  mypre.innerHTML = mypre.innerHTML + text;
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function runit() {
  // This clears the canvas, in case it was needed before, but is not required in newly ran code
  // Otherwise, it would clean itself afqter each run
  const canvas = document.getElementById("mycanvas");

  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  const codeDiv = document.getElementById("yourcode");
  const prog = codeDiv.textContent; // Use textContent to get the code

  const mypre = document.getElementById("output");
  mypre.innerHTML = '';
  Sk.pre = "output";
  Sk.configure({ output: outf, read: builtinRead });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';

  let myPromise = Sk.misceval.asyncToPromise(function () {
    return Sk.importMainWithBody("<stdin>", false, prog, true);
  });

  myPromise.then(function (mod) {
    console.log('success');
  },
    function (err) {
      console.log(err.toString());
    });
} 
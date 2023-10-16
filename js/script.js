function onKeyDown(e) {
  if (e.keyCode === 9) { // tab key
      e.preventDefault();  // this will prevent us from tabbing out of the editor

      // now insert four non-breaking spaces for the tab key
      var editor = document.getElementById("yourcode");
      var doc = editor.ownerDocument.defaultView;
      var sel = doc.getSelection();
      var range = sel.getRangeAt(0);

      var tabNode = document.createTextNode("\u0009");
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode); 
      sel.removeAllRanges();
      sel.addRange(range);
  }
}

document.addEventListener("keydown", onKeyDown);

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
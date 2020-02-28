---
layout: post
title: Installing LaTeX on Windows
date: '2018-02-24 22:04:51'
image: /assets/images/posts/2018-02-24-latex-ex.jpg
tags:
    - getting-started
    - maths
    - code
---

MiKTex + VS Code + Git = a semi working, compiling, version controlled version of LaTex. Try not to break anything on your journey tho; this worked for me so it will probably work for you... Heres how to do it:

### First Thing: Get The Stuff:

-   [MiKTeX](https://miktex.org/download)
-   [Git](https://git-scm.com/)
-   [VS Code](https://code.visualstudio.com/)

Install both of these to wherever your preferred location is; Once this is done it might be useful to add them to your path. Control Panel > System and Security > System > Advanced System Settings > Environment Variables. You should restart your machine before step 2.

### Then: Set up VS Code

In VS Code you'll need to install the [LaTaX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) using the tools in VS Code.

Once this is done and you've restarted VS Code the compile User Settings will need changing before it will work. (It might work; it depends if you have perl, I don't and I wanted to make the number of installs minimal)

```
"latex-workshop.latex.toolchain": [
        {
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-pdf",
                "%DOC%"
            ]
        }
    ]
```

needs changing to:

```
"latex-workshop.latex.toolchain": [
  {
    "command": "pdflatex",
    "args": [
      "-synctex=1",
      "-shell-escape",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ]
  }, {
    "command": "bibtex",
    "args": [
      "%DOCFILE%"
    ]
  }, {
    "command": "pdflatex",
    "args": [
      "-synctex=1",
      "-shell-escape",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ]
  }, {
    "command": "pdflatex",
    "args": [
      "-synctex=1",
      "-shell-escape",
      "-interaction=nonstopmode",
      "-file-line-error",
      "%DOC%"
    ]
  }
]
```

Save this and now go to your file you want to compile (if you want an example there is some code that will compile at the end of this tutorial). If youre checking out from Git you'll need to have done this all ready with `git checkout http://url/path.git`. If its not working there might be a problem with your git install or adding it to your PATH.

> note: `"-shell-escape"` is required for the package [minted](https://github.com/gpoore/minted)
> Also `"latex-workshop.latex.clean.enabled": false,` can be changed to `true` to delete files after the project is built

### Finally: Get everything built and looking smart:

Building your project should be easy enough; either run the build with `Right Click > Build LaTeX project` or `Ctrl + Alt + L > Build LaTeX project` or just save the file after editing it. Then, if settings were changed then 4 steps should run and everything should work:
![failed](..assets/img/content/2018/03/failed.png)
If it fails checking the compiler logs will tell you why. Its probably a syntax error (them pesky buggers get me every time), or a an issue with packages (make sure you tab over and install them the first time they're being used).

**GOOD LUCK!**

---

```
\documentclass[12pt]{article}
\begin{document}
Yay it worked!

\[f(x) = \fract{3}{2x} - 8\]

\end{document}
```

[Or try a more complicated one!](http://physics.clarku.edu/sip/tutorials/TeX/intro.html)

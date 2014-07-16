# Vim Primer

Learning Vim with Lovejoy! I wrote this for my co-workers, so the *Getting
Started* section makes some assumptions about the environment. Everything in
here applies to any copy of Vim 7.2+, with the exception of a couple plugins,
such as [NERDTree](http://github.com/scrooloose/nerdtree) and
[Surround](http://github.com/tpope/vim-surround).

If you want to work entirely in the terminal, I recommend `tmux` to keep
multiple workspaces open at one time. At the end of this document are some
suggestions regarding `tmux`.

### Just want a cheatsheet? [Here ya go](cheatsheet.mkd).

## Getting Started

Vim ships with a built-in tutor: a text file designed to be messed with, which
walks you through the core functionality in 30 minutes. If you want to start
there, detach from tmux (`control+a d`) and run `vimtutor`.

For more info on a command, do `:help substitute`, or whatever command you want
to know about.

If you are already acquainted with the basics, I'll just share some of the
features that I use most often. One thing to note: Vim commands are case-
sensitive, so when I list a command as `I`, that's `shift+i`.

## Useful Commands

### navigating quickly

In Normal Mode, these commands will move your cursor around the file in
meaningful ways.

- `/` to search using RegExp
  - Use `*` to search for other instances of the word under your cursor.
  - While searching, type `n` for the next match and `N` for the previous
    match.
  - Use `:set ic` and `:set noic` to toggle ignoring case in your searches
    (long names are `ignorecase` and `noignorecase`).
    This also applies to substitutions.
- go to the other end of a parenthetical by typing `%`. Useful for traversing
  functions; bummer in CoffeeScript.
- go to line 5 with `:5`. Toggle line number display with `:set number` and
  `:set nonumber`.
- `gg` to go to the top of the file, `G` to go to the bottom.
- `H` to go to the top of your view, `L` to go to the bottom of your view.
- `control-b` and `control-f` are equivalent to `pageup` and `pagedown`,
  respectively
- `control-u` and `control-d` move up and down, respectively, by half the view.

### substitution (find/replace)

`:%s/foo/bar/g` will replace "foo" with "bar" across the whole file `%`, and
multiple times on each line `g`.

If you leave off the `%`, the substitution will only work on the line where
your cursor sits. You can make a selection with `V`, and then `:` will insert
`'<,'>` before your command. This defines the scope of the command as
everything in your selection.

Here are some flags (the characters at the end of your RegExp) to remember

- `g` - match multiple instances on each line
- `c` - ask for confirmation for each substitution (allows you to skip some)
- `e` - suppress errors (useful for batching across files)...

You can also substitute across multiple files. You can't undo this from within
Vim, so be sure that your files are versioned, or that you don't care what
happens to them. To start, either open vim with an argument list like
`vim *.js`, or `vim $(grep -rIl 'foo' .)`. You can do the former within vim
with `:args *.js`.

The magic happens with `:argdo`. To substitute across all the files you listed
in the arguments, do `:argdo %s/foo/bar/ge | update`. That last bit is
important. ` | update` writes the file if anything has changed, so that Vim can
continue to the next file in the list.

### setting options

Many options can be set with the `:set` command. Most options have long and
short names. It's useful to know both, since the short commands are usually
acronyms, and can be difficult to remember if you don't know what they stand
for.

It's important to keep your whitespace and indentation uniform. Here are the
options to control indentation:

- `:set ts=2` or `:set tabstop=2` - how many columns a tab character covers
- `:set sw=2` or `:set shiftwidth=2` - how many columns are inserted when
  you hit the "tab" key.
- `:set et` or `:set expandtab` - use only space characters when indenting
- `:set noet` or `:set noexpandtab` - use tab characters for indenting, and
  spaces for the remainder of the "tabstop" value.

Our team is using two-space soft tabs, which would be `:set ts=2 sw=2 et`.

### repetitive tasks

#### repeat with `.`
Type `.` to repeat your last action from the current cursor position. This is
useful in conjunction with a search and `n`, `N`.

If you need to enter the same text on several lines, you should use a block
selection. `control+v` lets you select a block.

- `I` lets you type something to insert at the beginning of that block on
  each line. `A` does the same thing, but appends at the right edge of the
  block.
- `y` will 'yank', as usual, but when you `p`ut, it will insert as a column,
  offsetting the text below your cursor.

#### macros

Literally any command within Vim can be recorded and repeated as a macro. To
start recording a macro, type `q` in Normal Mode, then choose a letter to
assign to it.  Do your action, then, type `q` again in Normal Mode. You can run
the macro now with `@a`. To run the same macro again, use `@@`.

Here's a good example of the power of macros: I have two files open, a plain
text list of names and an XML document with empty tags. I can begin recording
my macro in the first file, copy the name (really, the first character to the
last `0v$y`), switch to the XML file, find the next empty block and paste in
the name with `p`. I then switch back to the first document and make sure that
my cursor is in a similar place relative to the next line as it was to my first
line, then type `q` to end recording. Now I have a repetitive action recorded,
and I can just run the macro again and again and it will populate all the
names.

### external commands

When in `:` command mode, type `!` before a shell command and you'll see its
output in a temporary shell. If you give it a range, it will pipe that text
into the command, and replace that range with the output. For example:
`:%!sort` will sort all the lines in the file (alphanumerically).

`%` defines the scope of the command to the entire open file. You can also
select one or more lines with `V` and when you type `:`, `'<,'>` will be
prepended to your command, setting the scope of the command to just those lines
you selected.

Just as you can give `%` as a scope for vim commands, you can also use it to
refer to the current file in external commands, such as `:!grep -n 'foo' %`. In
fact, you should try out that command now.

Some other examples of what you might use this for:

- `:!git diff HEAD %` to show what changes have been made to the current file
- `:!git blame %` 

### formatting

- select lines with `V`, and type `>` or `3>` to indent by 1 or three tab
  spaces.
- You turn many lines into one, separated by spaces, by selecting the text and
  typing `J`.
- You can use `=` on a selection to indent according to syntax, as long as Vim
  has a definition for the current file type.
- select some text with `V`, then type `gq` to hard-wrap that text to 80
  character lines, taking indentation into account. Single newlines are treated
  as continuing text, and double newlines remain intact. This is useful for
  Markdown, for instance, or for HTML with lots of text.
  - If you're doing this a lot, you may want to `:set textwidth=79` or `:set
    tw=79`, to enable hard wrapping (the same thing that `gq` is doing, but
    automatic). To turn it off again, `:set tw=0`.

### viewing your file

- You can "fold" some file types, depending on which syntaxes have been
  configured in Vim. This system has been configured to understand fold points
  in object-oriented PHP, JavaScript, Markdown, and other file types.

  Each fold command begins with `z` in Normal mode. Here they are:
  - `zM` and `zR` - minimize and reestore all folds
  - `zo` and `zc` - open and close the fold under the cursor
  - `zO` and `zC` - open and close *all* the folds under the cursor
- `:set wrap` and `:set nowrap` to toggle software wrapping. It's my preference
  to view code without wrapping, so that the structure is more apparent. If you
  are using wrapping, then you'll want to use `gj` and `gk` to move down and up
  along the wrapped lines, not just on the real lines.

### editing multiple files 

To open a file from within Vim, `:e filename.js`. You can do this in some more
useful ways:

- `:new filename.js` opens the file in a horizontal split. `:vnew filename.js`
  opens in a vertical split.
  - these same commands with a directory name (e.g. `.`) open the file browser.
    In this installation, the browser is [NERDTree](http://github.com/scrooloose/nerdtree). The basics apply to most of
    these: move up and down the tree, use the `<enter>` key to choose a file or
    directory.
  - `control+w (h|j|k|l)` moves to the window to the (left|top|bottom|right) of
    the current one.
  - `control+w |` expands your current window to the full width of your
    terminal
  - `control+w _` expands your current window to the full height of your
    terminal
  - `control+w =` gives equal space to all your windows
  - `control+w x` switches the current window with the next window

### surround plugin

I use the [Surround](http://github.com/tpope/vim-surround) plugin constantly.
The [README](http://github.com/tpope/vim-surround) there is very useful. One
point that I will emphasize, though I seldom use it, except when starting a new
HTML file, is inserting surrounds while in Insert Mode by using `control+s<div
class="nice">` or `control+s control+s<html>`. Once for surrounding inline, and
twice for surrounding in a block.

## So, this was *kinda* useful...

I recognize this may not be the best way to learn Vim commands. Practice is
best, and `vimtutor` gives a good sandbox for that. I hope to update this
primer to be more practical, with most of the info shared in context of
relevant code.

## tmux

If you're going to spend a lot of time in the terminal, I highly recommend
`tmux`, the Terminal MUltipleXer, which lets you switch back and forth between
processes. If you get used to it on your local environment, then you'll be just
as much at home when you log in to a server.

- the command prefix is `control+a`
- to change to window 1, use `control+a 1`
  - ...unless you're in tmux on your local machine as well, in which case
    you'll use your local prefix first; if that's `control+a`, then use
    `control+a control+a 1`). When there are two commands in a row that use the
    same modifier key (e.g. `control`), you can just hold that key down (you
    might read this command as "hold `control` and type `a a`, then release
    `control` and type `1`").
- to switch panes (splits within a window), use `control+a control+(h|j|k|l)`.
  - left:  `h`
  - down:  `j`
  - up:    `k`
  - right: `l`
- to detach tmux: `control+a d`
  - Please detach tmux before you log off the server with `control+d`. If you
    use `control+d` inside tmux, you'll close that window, which is not very
    nice to the rest of us.

Here is a sample `.tmux.config` file which will enable the vim-like controls
listed above. It's borrowed in part from [Maximum
Awesome](https://github.com/square/maximum-awesome), and you may want to just install that instead.

``` conf
# use C-a, since it's on the home row and easier to hit than C-b
set-option -g prefix C-a
unbind-key C-a
bind-key C-a send-prefix

# vi is good
setw -g mode-keys vi

# use vim-like keys for splits and windows
bind-key v split-window -h
bind-key s split-window -v

bind-key c new-window

bind-key [ copy-mode
bind-key ] paste-buffer

# Setup 'v' to begin selection as in Vim
bind-key -t vi-copy v begin-selection
bind-key -t vi-copy r rectangle-toggle
bind-key -t vi-copy y copy-selection

# Add control + Vi-style directions to switch panes
bind-key -r       C-k select-pane -U
bind-key -r       C-j select-pane -D
bind-key -r       C-h select-pane -L
bind-key -r       C-l select-pane -R
```

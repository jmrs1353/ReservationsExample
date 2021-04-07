(function ($) {
  var env = {
    foo: {
      "foo.txt": "foo.txt content",
      "bar.txt": "bar.txt content"
    },
    bar: {
      "page.html": "<html></html>",
      "style.css": "body { overflow: scroll; }",
      baz: {
        "foo.txt": "Hello"
      }
    },
    "baz.txt": "baz.txt content",
    "quux.txt": "quux.txt content",
    "lorem.svg": "lorem.svg content",
    "ipsum.doc": "ipsum.doc content",
    "dolor.txt": "dolor.txt content",
    "sit.jpg": "sit.jpg content",
    "amet.gif": "amet.gif content"
  };
  function get(path) {
    var current = env;
    browser.walk(path, function (file) {
      current = current[file];
    });
    return current;
  }
  function process(src, dest, remove) {
    console.log("process " + src + " => " + dest);
    var file = env;
    var name;
    browser.walk(src, function (part, last) {
      var src = file[part];
      if (last) {
        if (remove) {
          delete file[part];
        }
      }
      file = src;
    });
    var current = env;
    browser.walk(dest, function (part, last) {
      if (!last) {
        current = current[part];
      } else {
        name = part;
      }
    });
    current[name] = file;
    var defer = $.Deferred();
    // one second delay promise that simulate ajax upload
    setTimeout(function () {
      defer.resolve();
    }, 1000);
    return defer.promise();
  }
  function upload(file, path) {
    var current = env;
    browser.walk(path, function (part) {
      if (!current[part]) {
        current[part] = {}; // upload new directory
      }
      current = current[part];
    });
    current[file.name] = "new file " + file.name;
    console.log("upload " + file.name + " to " + path + " directory");
    return $.when(true); // resolved promise
  }
  $(".browser").browse({
    root: "/Archivos",
    separator: "/",
    contextmenu: true,
    name: "filestystem",
    menu: function (type) {
      if (type == "li") {
        return {
          play: function ($li) {
            alert('winamp play "' + $li.text() + '"');
          },
          "add to playlist": function ($li) {
            alert('playlist "' + $li.text() + '"');
          }
        };
      }
    },
    rename: function (src, dest) {
      return process(src, dest, true);
    },
    refresh_timer: 0,
    copy: process,
    dir: function (path) {
      dir = get(path);
      var result;
      if ($.isPlainObject(dir)) {
        result = { files: [], dirs: [] };
        Object.keys(dir).forEach(function (key) {
          if (typeof dir[key] == "string") {
            result.files.push(key);
          } else if ($.isPlainObject(dir[key])) {
            result.dirs.push(key);
          }
        });
      }
      return $.when(result); // resolved promise
    },
    upload: function (file, path) {
      return upload(file, path);
    },
    open: function (filename) {
      var file = get(filename);
      if (typeof file == "string") {
        alert(file);
      }
    }
  });
  var browser = $(".browser").eq(0).browse();
})(jQuery);
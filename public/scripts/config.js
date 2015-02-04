require.config({
  paths: {
    "underscore": "../bower_components/underscore/underscore",
    "jquery": "../bower_components/jquery/dist/jquery",
    "backbone": "../bower_components/backbone/backbone",
    "parse": "../bower_components/parse/parse"
  },

  shim: {
    parse: {
      deps: ['jquery', 'underscore'],
      exports: 'Parse'
    }
  },

  deps: ["main"]
});

require(['parse'], function(Parse) {
  Parse.initialize("mC0kcnL6GCHzwKbLbTf9I67uycH5nfodnMe3s5dA",
                   "5iBZAyznuUc446Ckuu9sEKRX92OEdSa0trk0PS9J");
});

/* global hexo */

'use strict';

let cheerio;

hexo.extend.filter.register('after_post_render', data => {
  var theme = hexo.theme.config;
  // Exit if `exturl` option disable in NexT.
  if (!theme.exturl) return;

  const url = require('url');

  if (!cheerio) cheerio = require('cheerio');

  const $ = cheerio.load(data.content, {decodeEntities: false});

  var config = this.config;
  var siteHost = url.parse(config.url).hostname || config.url;

  $('a').each(() => {
    var href = $(this).attr('href');
    // Exit if the href attribute doesn't exists.
    if (!href) return;

    var data = url.parse(href);

    // Exit if the link doesn't have protocol, which means it's an internal link.
    if (!data.protocol) return;

    // Exit if the url has same host with `config.url`.
    if (data.hostname === siteHost) return;

    // If title atribute filled, set it as title; if not, set url as title.
    var title = $(this).attr('title') || href;

    var encoded = Buffer.from(href).toString('base64');

    $(this).replaceWith(() => {
      return $(`<span class="exturl" data-url="${encoded}" title="${title}">${$(this).html()}<i class="fa fa-external-link"></i></span>`);
    });

  });

  data.content = $.html();
}, 0);

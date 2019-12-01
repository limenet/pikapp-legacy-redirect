const express = require('express');
const vhost = require('vhost');

const app = express();
const port = 8000;

function url(client, path = '') {
  return `https://${client}.pik.app/redirect-legacy/${path}`;
}

function getId(slug) {
  const id = slug
    .split('--')
    .pop()
    .replace('-', '');

  if (!parseInt(id)) {
    throw Error;
  }
  return id;
}

app.use(
  // eslint-disable-next-line no-unused-vars
  vhost('*.pikapp.ch', function handle(req, res, next) {
    next();
  })
);

app.use((req, res, next) => {
  if (!req.vhost || !req.vhost.length) {
    res.sendStatus(404);
  } else {
    next();
  }
});

app.get('/redirect/task/:id/?', (req, res) => {
  if (!parseInt(req.params.id)) {
    throw Error;
  }
  res.redirect(301, url(req.vhost[0], `task/${req.params.id}`));
});

app.get('/tasks/:project/:task', (req, res) => {
  res.redirect(301, url(req.vhost[0], `task/${getId(req.params.task)}`));
});

app.get('/projects/:project', (req, res) => {
  res.redirect(301, url(req.vhost[0], `project/${getId(req.params.project)}`));
});

app.get('/projectviews/:projectview', (req, res) => {
  res.redirect(
    301,
    url(req.vhost[0], `projectview/${getId(req.params.projectview)}`)
  );
});

app.get('*', (req, res) => {
  res.redirect(301, url(req.vhost[0]));
});

app.listen(port);

module.exports = app;

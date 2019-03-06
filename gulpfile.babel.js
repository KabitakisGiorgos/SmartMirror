'use strict';

import del from 'del';
import _ from 'lodash';
import gulp from 'gulp';
import path from 'path';
import open from 'open';
import nodemon from 'nodemon';
import through2 from 'through2';
import lazypipe from 'lazypipe';
import ts from 'gulp-typescript';
import crossSpawn from 'cross-spawn';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import * as amiconfig from '@amisolertis/utils-config';

var plugins = gulpLoadPlugins();
var config;
const isWin = /^win/.test(process.platform);

const srcPath = 'src';
const clientPath = 'client';
const serverPath = 'server';
const testsPath = 'tests';
const paths = {
  client: {
    assets: `${srcPath}/${clientPath}/assets/**/*`,
    test: [`${srcPath}/${clientPath}/app/**/*.{spec,mock}.ts`],
    scripts: [`${srcPath}/${clientPath}/**/!(*.spec|*.mock).ts`]
  },
  server: {
    scripts: [
      `${srcPath}/${serverPath}/**/!(*.spec|*.integration).ts`,
      `!${srcPath}/${serverPath}/config/local.env.sample.ts`
    ],
    assets: [`${srcPath}/${serverPath}/**/!(*.ts|tsconfig.server.json)`],
    test: {
      integration: [
        `${srcPath}/${serverPath}/**/*.integration.ts`,
        'mocha.global.ts'
      ],
      unit: [`${srcPath}/${serverPath}/**/*.spec.ts`, 'mocha.global.ts']
    },
    ts_config: `${srcPath}/${serverPath}/tsconfig.server.json`
  },
  karma: 'karma.conf.ts',
  dist: 'dist'
};


//---------------------------------------------------------
// #region Helper functions

/**
 * Log any message of nodemon
 *
 * @param {string} log
 */
function onServerLog(log) {
  console.log(
    plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message
  );
}

// #endregion Helper functions
//---------------------------------------------------------

//---------------------------------------------------------
// #region Reusable pipelines

let lintScripts = lazypipe()
  .pipe(plugins.tslint, { formatter: "stylish" }, require(`./tslint.json`))
  .pipe(plugins.tslint.report, { emitError: false });


let lintServerTestScripts = lazypipe()
  .pipe(plugins.tslint, {
    configFile: './tslint.json',
    envs: ['node', 'es6', 'mocha'],
    formatter: "stylish"
  })
  .pipe(plugins.tslint.report, { emitError: false });

// #endregion Reusable pipelines
//---------------------------------------------------------

//---------------------------------------------------------
// #region Linting Tasks

gulp.task('lint:scripts', cb =>
  runSequence('lint:scripts:client', 'lint:scripts:server', cb)
);

gulp.task('lint:scripts:client', () => {
  return gulp.src(_.union(
    paths.client.scripts,
    _.map(paths.client.test, blob => `!${blob}`)
  ))
    .pipe(lintScripts());
});

gulp.task('lint:scripts:server', () => {
  return gulp.src(_.union(
    paths.server.scripts,
    _.map(paths.server.test, blob => `!${blob}`)
  ))
    .pipe(lintScripts());
});

// #endregion Linting Tasks
//---------------------------------------------------------

//---------------------------------------------------------
// #region Environment

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${paths.dist}/${serverPath}/config/local.env`);
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});

gulp.task('set:env:test', () => {
  amiconfig.setEnvironment(amiconfig.ENVIRONMENTS.test);
  plugins.env({
    vars: { NODE_ENV: 'test' }
  });
});

gulp.task('set:env:dev', () => {
  amiconfig.setEnvironment(amiconfig.ENVIRONMENTS.development);
});

gulp.task('set:env:prod', () => {
  amiconfig.setEnvironment(amiconfig.ENVIRONMENTS.production);
  plugins.env({
    vars: { NODE_ENV: 'production' }
  });
});

// #endregion Environment
//---------------------------------------------------------

//---------------------------------------------------------
// #region Clean

gulp.task('clean', () => {
  return del([
    `.tmp/**/*`,
    `${paths.dist}/**/*`
  ], { dot: true });
});

// #endregion Clean
//---------------------------------------------------------

//---------------------------------------------------------
// #region Client

gulp.task('start:client:dev', cb => {
  crossSpawn('ng',
    ['serve', '--proxy-config', 'src/client/proxy.conf.js', '--port', config.clientPort, '--open'],
    { stdio: ['ignore', process.stdout, process.stderr] }
  );
});

gulp.task('build:client', cb => {
  let ng = crossSpawn.sync('ng',
    ['build', '--aot', '--env=prod'],
    { stdio: ['ignore', process.stdout, process.stderr] }
  );
  cb();
});

gulp.task('start:client:prod', cb => {
  open(`http://localhost:${config.port}`);
  cb();
});

// #endregion Client
//---------------------------------------------------------

//---------------------------------------------------------
// #region Server

gulp.task('watch:server', () => {
  gulp.watch(`${srcPath}/${serverPath}/**/*.ts`, ['server:compile:ts']);
  gulp.watch(`${srcPath}/${serverPath}/**/!(*.ts)`, ['server:copy:assets']);
});

gulp.task('server:copy:assets', () => {
  return gulp
    .src(paths.server.assets)
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('start:server:dev', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${paths.dist}/${serverPath}/config/environment`).default;
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`).default;
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

const tsProject = ts.createProject(paths.server.ts_config);
gulp.task('server:compile:ts', () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('build:server', cb => {
  runSequence('server:compile:ts', 'server:copy:assets', cb);
});

// #endregion Server
//---------------------------------------------------------

//---------------------------------------------------------
// #region Main Tasks

gulp.task('copy:dist:prerequisites', () => {
  return gulp.src(['package.json', 'config/*'], { base: '.' })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:dist', cb => {
  runSequence(
    'clean',
    'set:env:prod',
    'copy:dist:prerequisites',
    'build:server',
    'build:client',
    cb);
});

gulp.task('serve:dist', cb => {
  runSequence(
    'build:dist',
    'start:server:prod',
    'start:client:prod',
    cb
  );
});

gulp.task('serve', cb => {
  runSequence(
    'clean',
    'set:env:dev',
    'lint:scripts',
    ['server:compile:ts', 'server:copy:assets'],
    'env:all',
    'start:server:dev',
    'watch:server',
    'start:client:dev',
    cb
  );
});

// #endregion Main Tasks
//---------------------------------------------------------

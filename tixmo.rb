require 'rubygems'
require 'bundler'
Bundler.setup
require 'sinatra'
require 'tixato_proxy'
require 'logger'

use TixatoProxy

get '/' do
  send_file 'public/index.html'
end

get '*' do
  request.env['DO_PROXY'] = true
  # rack should step in here?
end
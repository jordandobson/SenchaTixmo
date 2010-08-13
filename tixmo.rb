require 'rubygems'
require 'bundler'
Bundler.setup
require 'sinatra'
require 'tixato_proxy'
require 'rack/cache'
require 'logger'

use Rack::Cache,
  :verbose     => false,
  :metastore   => 'file:tmp/cache/rack/meta',
  :entitystore => 'file:tmp/cache/rack/body'
  
use TixatoProxy

get '/' do
  send_file 'public/index.html'
end

get '*' do
  request.env['DO_PROXY'] = true
  # this gets handled by tixato proxy
end
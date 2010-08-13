require 'rubygems'
require 'bundler'
Bundler.setup
require 'sinatra'
require 'tixato_proxy'
require 'rack/cache'
require 'logger'

use Rack::Cache,
  :verbose     => true,
  :metastore   => 'file:tmp/cache/rack/meta',
  :entitystore => 'file:tmp/cache/rack/body'
  
use TixatoProxy

helpers do
  def proxy
    if ENV['RACK_ENV'] == 'development'
      request.env['X_PROXY'] = 'm.tixato.dev'
      request.env['X_PROXY_PORT'] = 3000
    else
      request.env['X_PROXY'] = 'm.tixatobeta.com'
    end
    # this gets handled by tixato proxy
  end
end

get '/' do
  send_file 'public/index.html'
end

get '*' do
  proxy
end

post '*' do
  proxy
end

put '*' do
  proxy
end

delete '*' do
  proxy
end
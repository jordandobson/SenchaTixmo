require 'rubygems'
require 'bundler'
Bundler.setup
require 'tixato_proxy'
require 'tixmo'

use TixatoProxy
run Sinatra::Application

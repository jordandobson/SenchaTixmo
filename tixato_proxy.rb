require 'rack/proxy'
require 'logger'

class TixatoProxy < Rack::Proxy
  
  LOGGER = Logger.new(STDOUT)
  
  def initialize(app)
    @app = app
  end
  
  def call(env)
    triplet = @app.call(env)
    if env['DO_PROXY']
      rewrite_response(perform_request(rewrite_env(env)))
    else
      triplet
    end
  end
  
  def rewrite_env(env)
    env['HTTP_HOST'] = 'tixatobeta.com'
    
    env['SERVER_PORT'] = 80
    # env['SERVER_PORT'] = 443
    # env['rack.url_scheme'] = 'https'
    
    r = Rack::Request.new(env)
    LOGGER.warn "requesting #{r.url}"
    env
  end
  
end
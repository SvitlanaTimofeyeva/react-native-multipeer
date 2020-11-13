require 'json'
version = JSON.parse(File.read('package.json'))["version"]

Pod::Spec.new do |s|

  s.name            = "RCTMultipeerConnectivity"
  s.version         = version
  s.homepage        = "https://github.com/SvitlanaTimofeyeva/react-native-multipeer.git"
  s.summary         = "multipeer connectivity"
  s.license         = "MIT"
  s.author          = { "Test" => "testitnow0001@gmail.com" }
  s.ios.deployment_target = '7.0'
  s.tvos.deployment_target = '9.0'
  s.source          = { :git => "https://github.com/SvitlanaTimofeyeva/react-native-multipeer.git", :tag => "v#{s.version}" }
  s.source_files    = 'RCTMultipeerConnectivity/*.{h,m}'
  s.preserve_paths  = "**/*.js"

  s.dependency 'React'

end

# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

# If you are developing a hex package, this config will not be included
# with your published library.
#
# If your config ships with your library or
# production application, you may want to move this line to the desired
# environment config file. e.g. config/dev.exs, config/test.exs
import_config "../test_app/phx_test_app/config/config.exs"

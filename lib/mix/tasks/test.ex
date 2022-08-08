defmodule Mix.Tasks.Svonix.Test do
  @phx_test_folder "test_app"

  def run(_) do
    deps_paths = Mix.Project.deps_paths(depth: 1)
    path_to_phx_test = Map.fetch!(deps_paths, :phx_test)

    # make new phoenix test.
    # Mix.Tasks.PhxTest.New.run()
  end
end

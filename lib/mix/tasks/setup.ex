defmodule Mix.Tasks.Svonix.Setup do
  def run(_) do
    deps_paths = Mix.Project.deps_paths(depth: 1)
    path_to_svonix = Map.fetch!(deps_paths, :svonix)

    # Copy all files in Svonix assets directory to parent app ('assets/svonix_file').
    Path.wildcard(Path.join(path_to_svonix, "assets/*"))
    |> Enum.each(fn file -> 
      Mix.Generator.copy_file(file, "assets/" <> Path.basename(file))
    end)

    Mix.Generator.create_directory("assets/js/svelte")

    # Run npm install (use :os.cmd for simplicity)
    IO.puts "Running npm install. This might take a second."
    npm_result = "cd assets && npm install" |> String.to_charlist() |> :os.cmd
    IO.puts npm_result
  end
end

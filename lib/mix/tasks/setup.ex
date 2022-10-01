defmodule Mix.Tasks.Svonix.Setup do
  # @config_file "config/dev.exs"
  @js_file "assets/js/app.js"
  @esbuild_regex ~r/esbuild: {.*}/
  @watcher_regex ~r/watchers:\s\[/

  def run(_) do
    config_file = find_dev_config_file()
    default_deps_paths = Mix.Project.deps_paths(depth: 1)
    path_to_svonix = Map.fetch!(default_deps_paths, :svonix)
    path_to_svonix_assets = Path.join(path_to_svonix, "assets/*")

    # Copy all files in Svonix assets directory to parent app ('assets/svonix_file').
    copy_files(path_to_svonix_assets, "assets/")

    Mix.Generator.create_directory("assets/js/svelte")

    # Inject watcher into config/dev.exs
    inject_watcher(config_file)

    # Inject js svonix import into app.js
    inject_import(@js_file)

    # Run npm install (use :os.cmd for simplicity)
    IO.puts("Running npm install. This might take a second.")
    npm_result = "cd assets && npm install" |> String.to_charlist() |> :os.cmd()
    IO.puts(npm_result)
  end

  defp copy_files(from, into) do
    Path.wildcard(from)
    |> Enum.each(fn file ->
      Mix.Generator.copy_file(file, into <> Path.basename(file))
    end)
  end

  defp inject_import(js_path) do
    import_stmt = ~s"""
    import 'svonix'
    """

    File.read!(js_path)
    |> concat_before(import_stmt)
    |> save_into(js_path)

    Mix.shell().info([:green, "Added 'svonix' import ", :reset, @js_file])
  end

  defp find_dev_config_file() do
    config_path =
      Mix.Project.config_files()
      |> List.first()
      |> Path.dirname()

    config_file =
      Mix.Project.config_files()
      |> Enum.find(:not_found, fn file -> file =~ "dev.exs" end)

    if config_file == :not_found do
      Mix.shell().info([:red, "Could not find a 'dev.exs' config file at #{config_path}", :reset])
      raise "dev.exs not found"
    else
      config_file
    end
  end

  @spec concat_before(String.t(), String.t()) :: String.t()
  defp concat_before(source, to_concat), do: to_concat <> source

  defp inject_watcher(config_path) do
    watcher = ~s"""
    \n\t# Watcher for sveltex files
    \tnode: ["build.js", "--watch", cd: Path.expand("../assets", __DIR__)],
    """

    File.read!(config_path)
    |> insert_after(@watcher_regex, watcher)
    |> inform_status
    |> comment_out(@esbuild_regex)
    |> inform_status
    |> save_into(config_path)
  end

  defp save_into(source, target_file), do: File.write!(target_file, source)

  @spec insert_after(String.t(), Regex.t(), String.t()) ::
          {:insert_ok, String.t()} | {:insert_error, String.t()}
  def insert_after(source, regex, to_insert) do
    case Regex.run(regex, source, return: :index) do
      [{pos, len}] -> {:insert_ok, insert_after_position(source, pos + len, to_insert)}
      nil -> {:insert_error, source}
    end
  end

  @spec comment_out(String.t(), Regex.t()) :: String.t() | :error
  def comment_out(source, regex) do
    case Regex.run(regex, source, return: :index) do
      [{pos, _len}] -> {:comment_ok, comment_out_at_position(source, pos)}
      nil -> {:comment_error, source}
    end
  end

  @spec insert_after_position(String.t(), integer, String.t()) :: String.t()
  def insert_after_position(source, position, to_insert) do
    {head, tail} = String.split_at(source, position)
    head <> to_insert <> tail
  end

  @spec comment_out_at_position(String.t(), integer) :: String.t()
  def comment_out_at_position(source, position) do
    insert_after_position(source, position, "# ")
  end

  defp inform_status({:insert_error, source}) do
    Mix.shell().info([
      :red,
      "Could not insert watcher, please do so yourself in dev.exs",
      :reset
    ])

    source
  end

  defp inform_status({:insert_ok, source}) do
    Mix.shell().info([:green, "Inserted watcher in config in dev.exs", :reset])
    source
  end

  defp inform_status({:comment_ok, source}) do
    Mix.shell().info([:green, "Commented out esbuild watcher in dev.exs", :reset])
    source
  end

  defp inform_status({:comment_error, source}) do
    Mix.shell().info([:yellow, "Could not comment out esbuild watcher in dev.exs", :reset])
    source
  end
end

defmodule Svonix.MixProject do
  use Mix.Project

  def project do
    [
      app: :svonix,
      version: "0.6.3",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: "A library for easily integrating Svelte components into Phoenix",
      package: package()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp package() do
    [
      licenses: ["MIT"],
      source_url: "https://github.com/nikokozak/svonix",
      links: %{
        "Github" => "https://github.com/nikokozak/svonix"
      },
      files: ~w(lib assets priv .formatter.exs mix.exs README* readme* LICENSE*
                license* CHANGELOG* changelog* src)
    ]
  end

  defp deps do
    [
      {:phoenix_html, "~> 3.2"},
      {:jason, "~> 1.3"}
    ]
  end
end

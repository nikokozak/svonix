defmodule Svonix.MixProject do
  use Mix.Project

  def project do
    [
      app: :svonix,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:phoenix_html, "~> 3.2"},
      {:jason, "~> 1.3"}
    ]
  end
end

defmodule Svonix.MixProject do
  use Mix.Project

  def project do
    [
      app: :svonix,
      version: "0.5.1",
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
      # Phx_test
      {:phx_test_app, path: "./test_app/phx_test_app", only: [:test, :dev]},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:floki, ">= 0.30.0", only: :test},

      {:phoenix_html, "~> 3.2"},
      {:jason, "~> 1.3"},
      {:phx_test, "~> 0.1.0", only: [:dev, :test]}
    ]
  end
end

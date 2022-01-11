defmodule Svonix do
  @moduledoc """
  Svonix is a small library to make embedding svelte components as easy as possible when it comes to works with Phoenix.
  Svonix is loosely based on `Sveltex`, but is compatible with Phoenix `> 1.6`, and imports compiled Svelte components only
  when necessary, to save space and bandwidth.
  """

  @doc """
  Renders a div tag that our svelte component can hook onto. 

  `name` - must match the name of the `.svelte` component you're referencing in `assets/svelte/`.
  `props` - a `Map` through which you can pass in props referenced in your Svelte component.
  """
  def render(name, props \\ %{}) do
    Phoenix.HTML.Tag.tag(:div,
      data: [props: payload(props)],
      id: "svonix-#{String.replace(name, " ", "-")}"
    )
  end

  defp payload(props) do
    props
    |> Jason.encode()
    |> case do
      {:ok, message} -> message
      {:error, _} -> ""
    end
  end

end

defmodule SvonixTest do
  use ExUnit.Case
  doctest Svonix

  test "greets the world" do
    assert Svonix.hello() == :world
  end
end

class RenamePokemonsToPokemon < ActiveRecord::Migration[6.0]
  def change
    rename_table :pokemons, :pokemon
  end
end

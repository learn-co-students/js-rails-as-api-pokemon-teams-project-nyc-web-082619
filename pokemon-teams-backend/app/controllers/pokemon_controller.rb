class PokemonController < ApplicationController
   
    def index
        pokemon = Pokemon.all
        render json: pokemon
    end

    def show
        pokemon = Pokemon.find(params[:id])
        render json: pokemon
    end

    def create
        name = Faker::Name.first_name
        species = Faker::Games::Pokemon.name
        trainer_id = params["trainerId"]
        render json: Pokemon.create(nickname: name, species: species, trainer_id: trainer_id)
    end

    def destroy
        Pokemon.destroy(params[:id])
    end

end

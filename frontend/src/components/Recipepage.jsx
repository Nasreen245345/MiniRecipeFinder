import React from 'react'
import { useRecipe } from '../Context/recipes'
import { useAuth } from '../Context/auth';
import { Star, Clock} from "lucide-react";
import api from "../services/api" 
const Recipepage = () => {
    const { recipe } = useRecipe()
    const {user}=useAuth()
   const handleFavourites=async (recipe)=>{
        if(user){
           try{
             const response=await api.post("/favourites",recipe)
            if(response.data.success){
                alert("Recipe added to favourite")
            }
           }catch(error){
            alert(error.response?.data?.message || error.message)
           }
        }
        else{
            alert("You need to login to mark Favourites")
        } 
  }
  
    
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {console.log(recipe)}
            <div className='relative'>
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-64 md:h-80 object-cover"
                />
                <div className='absolute top-4 right-4'>
                    <button 
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-red-50 transition-colors shadow-md" 
                        onClick={(e) => handleFavourites(recipe)}
                    >
                        <Star className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"/>
                    </button>
                </div>
                
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {recipe.strCategory}
                    </span>
                    <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {recipe.strArea}
                    </span>
                </div>
            </div>
            <div className="p-6 md:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {recipe.strMeal}
                    </h1>
                    
                    <div className='flex items-center gap-6 text-gray-600'>
                        <div className='flex items-center gap-2'>
                            <Clock className="w-5 h-5"/>
                            <span className="font-medium">30-45 mins</span>
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Ingredients
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
  <div className="grid gap-3">
    {recipe?.ingredients?.map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
      >
        <span className="text-gray-800 font-medium">{item}</span>
      </div>
    ))}
  </div>
</div>

                </div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                    <div className="prose prose-lg max-w-none">
                        <div className="bg-white border-l-4 border-orange-500 pl-6 py-4 rounded-r-lg shadow-sm">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {recipe.instructions}
                            </p>
                        </div>
                    </div>
                </div>
                
              
               
            </div>
        </div>
    )
}

export default Recipepage
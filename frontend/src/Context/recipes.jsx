import { useContext,createContext,useState,useEffect } from "react";
const RecipeContext=createContext()
export const RecipeProvider=({children})=>{
    const [recipe, setRecipes] = useState(null);
    const [favourites,setFavourites]=useState(null)
      const setData=(recipes,favourite)=>{
            setRecipes(recipes)
            setFavourites(favourite)
      }
      return (<RecipeContext.Provider value={{setData,recipe,favourites}}>{children}</RecipeContext.Provider>)
}
//custome hook to use this context
export const useRecipe=()=>{
    const context=useContext(RecipeContext)
    if(!context){
        alert("useRecipe must be within provider")
    }
    return context
}
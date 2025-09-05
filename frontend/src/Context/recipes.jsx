import { useContext,createContext,useState,useEffect } from "react";
const RecipeContext=createContext()
export const RecipeProvider=({children})=>{
    const [recipe, setRecipes] = useState(null);
      const setData=(recipes)=>{
            setRecipes(recipes)
      }
      return (<RecipeContext.Provider value={{setData,recipe}}>{children}</RecipeContext.Provider>)
}
//custome hook to use this context
export const useRecipe=()=>{
    const context=useContext(RecipeContext)
    if(!context){
        alert("useRecipe must be within provider")
    }
    return context
}
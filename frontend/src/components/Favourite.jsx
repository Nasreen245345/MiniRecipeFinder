import React, { useState, useEffect } from "react";
import { Filter, Search, Star, Clock , Trash } from "lucide-react";
import api from "../services/api"
import {useAuth} from "../Context/auth"
import { useRecipe } from "../Context/recipes";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate=useNavigate()
      const {setData}=useRecipe()
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectArea, setSelectArea] = useState("");
  const [selectIngredients, setSelectIngredients] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allrecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedRecipes, setDisplayedRecipe] = useState([]);
  const [mockRecipes,setmockRecipes]=useState([])
  const [categories,setCategories]=useState([])
    const [areas,setArea]=useState([])
    const [ingredients,setIngredients]=useState([])
  const {user}=useAuth()



  const recipesPerPage = 4;
  const fetchData=async ()=>{
try{
  const response =await api.get("/favourites")
  setmockRecipes(response.data)
  setAllRecipes(response.data)
  const uniquecategories = [];
  const uniqueAreas=[]
  const uniqueIngredients=[]
  for(let i=0;i<response.data.length;i++){
     let catagory=response.data[i].strCategory
     let area=response.data[i].strArea
     for(let j=0;j<response.data[i].ingredients.length;j++){
      let ingredient=response.data[i].ingredients[j]
      if(!uniqueIngredients.includes(ingredient)){
        uniqueIngredients.push(ingredient)
      }

     }
    if(!uniquecategories.includes(catagory)){
    uniquecategories.push(catagory)
    }
    if(!uniqueAreas.includes(area)){
      uniqueAreas.push(area)
    }
  }
  setIngredients(uniqueIngredients)
  setCategories(uniquecategories)
  setArea(uniqueAreas)
  setTotalPages(Math.ceil(response.data.length / recipesPerPage));
  }catch(error){
console.error(error.response.data.message)
setmockRecipes(null)
setAllRecipes(null)
  }

  }
useEffect(() => {
  fetchData()
  setCurrentPage(1);
}, [])

  const clearFilters = () => {
    setSelectCategory('');
    setSelectArea('');
    setSelectIngredients('');
    setSearchQuery('');
    setCurrentPage(1);
    setSortBy('name-asc');
  };

  const updateDisplayedRecipes = () => {
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    setDisplayedRecipe(allrecipes.slice(startIndex, endIndex));
  };
  const handleSearch = () => {
    setLoading(true);
    
    let filteredRecipes = [...mockRecipes];
    if (searchQuery) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectCategory) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.strCategory === selectCategory
      );
    }
    if (selectArea) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.strArea === selectArea
      );
    }
    if (selectIngredients) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.ingredients.some(ingredient=>(
            ingredient.toLowerCase().includes(selectIngredients.toLowerCase())
        )
            )
      );
    }
    if (sortBy === 'name-asc') {
      filteredRecipes.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sortBy === 'name-desc') {
      filteredRecipes.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    }

    setAllRecipes(filteredRecipes);
    setTotalPages(Math.ceil(filteredRecipes.length / recipesPerPage));
    setLoading(false);
  };
  useEffect(() => {
    updateDisplayedRecipes();
  }, [allrecipes, currentPage]);
  useEffect(() => {
    setCurrentPage(1); 
    handleSearch();
  }, [selectArea, selectCategory, searchQuery, selectIngredients, sortBy]);
     const handleDelete=async (recipe)=>{
        if(user){
           try{
             const response=await api.delete(`/favourites/${recipe.idMeal}`)
            if(response.data.success){
                alert("Recipe deleted succesfully")
            }
           }catch(error){
                alert(error.response?.data?.message || error.message)
           }
        }
        else{
            alert("You need to login to delete favourites")
        } 
  }
  const moveToCrard=(recipe)=>{
    console.log(recipe)
    setData(recipe)
    navigate("/recipeview")
}

  const RecipeCard = ({ recipe }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-95">
      <div className="relative">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors" onClick={(e)=>handleDelete(recipe)}>
            <Trash className="w-5 h-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
         <div className="flex gap-2">
          <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs flex justify-center items-center">
            {recipe.strCategory}
          </span>
          <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs flex justify-center items-center">
            {recipe.strArea}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">
          {recipe.strMeal}
        </h3>
       </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {recipe.strInstructions}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>30m</span>
            </div>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={()=>moveToCrard(recipe)}>
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-center p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Your Favourite Recipes
        </h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <button
            className="text-orange-500 flex justify-center items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <div className="flex justify-center items-center gap-2">
            <p>Sort by</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-500 py-2 px-3 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:outline-none focus:border-transparent"
            >
              <option value="name-asc">Name A→Z</option>
              <option value="name-desc">Name Z→A</option>
            </select>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-600">All Categories</label>
              <select
                value={selectCategory}
                onChange={(e) => setSelectCategory(e.target.value)}
                className="border-2 border-gray-200 w-full py-2 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-600">All Areas</label>
              <select
                value={selectArea}
                onChange={(e) => setSelectArea(e.target.value)}
                className="border-2 border-gray-200 w-full py-2 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-transparent"
              >
                <option value="">All Areas</option>
                {areas.map((area) => (
                  <option value={area} key={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-600">All Ingredients</label>
              <select
                value={selectIngredients}
                onChange={(e) => setSelectIngredients(e.target.value)}
                className="border-2 border-gray-200 w-full py-2 rounded-lg px-3 focus:ring-2 focus:ring-orange-200 focus:border-transparent"
              >
                <option value="">All Ingredients</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient} value={ingredient}>
                    {ingredient}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button 
                className="text-gray-500 text-sm font-medium hover:text-gray-700" 
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {loading ? 'Searching...' : `Found ${allrecipes.length} recipes`}
        </p>
       
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: recipesPerPage }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : displayedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedRecipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.idMeal}-${index}`} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex flex-col justify-center items-center gap-2 flex-wrap">
        
          
          <div>
            {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-orange-500 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 2 || 
              page === currentPage + 2
            ) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}
          </div>
          
         
          <span className="text-sm text-gray-500 ml-4">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default Home;
import React from 'react'

const Options=[
    {value:"Action",
     checked:false
    },
    {value:"Adventure",
     checked:false
    },
   {value: "Crime",
   checked:false
   },
   { value:"Comedy",
   checked:false
   },
    {value:"Fantasy",
    checked:false
    },
    {value:"Thriller",
    checked:false
    },
    {value:"Horror",
    checked:false
    },
    {value:"Sci-Fi",
    checked:false
    },
   { value:"Drama",
   checked:false
   },
   { value:"Western",
   checked:false
   }
  ]


const useGenreOptions = (array) => {
 return Options.map((value=>{
if(array.includes(value.value)){
return {...value,checked:true}
}else return {...value,checked:false}
  }))
}

export default useGenreOptions

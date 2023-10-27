# Create

>  ## Success
1. ✅ Receives a request **POST** at **/exercises**
2. ✅ Returns **201** with the created excercice data on response body

> ## Exceptions
1. ✅ Returns **400** if request body is empty
2. ✅ Returns **422** if request body is missing some required field
3. ✅ Returns **500** if some unexpected error occurs

<br>

# List

>  ## Success
1. ✅ Receives a request **GET** at **/exercises**
2. ✅ Returns **200** with a list of saved exercises on response body

> ## Exceptions
1. ✅ Returns **500** if some unexpected error occurs

<br>

# Read

>  ## Success
1. ✅ Receives a request **GET** at **/exercises/:id**
2. ✅ Returns **200** with a excercise data on response body

> ## Exceptions
1. ✅ Returns **404** if there are no saved exercise with the provided id
2. ✅ Returns **500** if some unexpected error occurs

<br>

# Update

>  ## Success
1. ✅ Receives a request **PATCH** at **/exercises/:id**
2. ✅ Returns **200** with the updated exercise data on response body

> ## Exceptions
1. ✅ Returns **400** if request body is empty
2. ✅ Returns **404** if there are no saved exercise with the provided id
3. ✅ Returns **500** if some unexpected error occurs

<br>

# Delete

>  ## Success
1. ✅ Receives a request **PATCH** at **/exercises/:id**
2. ✅ Returns **204**

> ## Exceptions
1. ✅ Returns **404** if there are no saved exercise with the provided id
2. ✅ Returns **500** if some unexpected error occurs

<br>
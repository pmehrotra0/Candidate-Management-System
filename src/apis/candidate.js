import axios from 'axios';

export async function fetchCandidateDetails(limit=10, skip=0, sorting, columnFilters){
    let filter = "";
    if(columnFilters.length !== 0){
        columnFilters.forEach(item => filter+='key='+item.id+"&value="+item.value);
        filter = "/filter?"+filter 
    }
    const { data } = await axios.get(`https://dummyjson.com/users${filter === "" ? '?' : filter+'&'}limit=${limit}&skip=${skip}${sorting.length !== 0 ? '&sortBy='+sorting[0].id+'&order='+(sorting[0].desc ? 'desc' : 'asc') : ""}`)
    return data;
}

export async function searchCandidateDetails(globalFilter){
    const { data } = await axios.get(`https://dummyjson.com/users${globalFilter ? '/search?q='+globalFilter : ""}`)
    return data;
}
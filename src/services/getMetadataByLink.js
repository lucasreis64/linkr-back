import urlMetadata from "url-metadata";


function isValidURL(str) {
    if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
         return true;
     } else {
         return false;
     }
 }

export const metadata = async (url) => {

    const default_metadata = {
        title: "shared link in linkr",
        image : "https://rafaturis.com.br/wp-content/uploads/2014/01/default-placeholder.png",
        url: url,
        description: "check this nice link shared in linkr!",
        headline: ""
    }

    if (isValidURL(url)){
       
        return urlMetadata(url).then(metadata => {
            
            return { 
                title: (metadata?.title ? metadata.title : "shared link in linkr"),
                image : (metadata?.image ? metadata.image: "https://rafaturis.com.br/wp-content/uploads/2014/01/default-placeholder.png"), 
                url: url,
                description: (metadata?.description ? metadata.description : "check this nice link shared in linkr"),
                headline: metadata?.headline,
            }
        }).catch(() => default_metadata);
    }else{
        return default_metadata;
    } 
    
}
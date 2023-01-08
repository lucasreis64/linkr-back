import urlMetadata from "url-metadata";


function isValidURL(str) {
    if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
         return true;
     } else {
         return false;
     }
 }

export const metadata = async (url) => {

    if (isValidURL(url)){
       
        return urlMetadata(url).then(metadata => {
            
            return { 
                title: metadata?.title,
                image : metadata?.image, 
                url: metadata?.url,
                description: metadata?.description,
                headline: metadata?.headline,
            }
        }).catch();
    }else{
        return null;
    } 
    
}
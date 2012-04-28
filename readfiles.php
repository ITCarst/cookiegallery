<?
$files = array();

$dir = opendir('gallery-images');
while ($file = readdir($dir)) {
    if ($file == '.' || $file == '..') {
        continue;
    }
    $files[] = $file;
}
header('Content-type: application/json');
echo json_encode($files);


/*
Header("content-type: application/x-javascript");
            
$gallery = opendir('gallery-images/');
	while (($file = readdir($gallery))!==false) {
        echo $file;
        /*
		if($file !='.' && $file != '..'){
			foreach (array($file) as $f){
                $images = opendir('gallery/'.$file.'/');
                while(($image = readdir($images)) !== false){
                    if($image !='.' && $image !='..'){
                        //echo $image;
                        $extension = substr($image, strpos($image,'.'));
                        if($extension = '.jpg' || $extension = '.JPG' || $extension = '.JPEG' || $extension = '.jpeg'){}
                    }
                }
            }
        }
    }		
closedir($gallery);*/
			/*
$pathstring  = pathinfo($_SERVER['PHP_SELF']);
$locationstring = "http://" . $_SERVER['HTTP_HOST'].$pathstring['dirname'] . "/";

function returnimages($dirname=".") {
	 $pattern="(\.jpg$)|(\.png$)|(\.jpeg$)|(\.gif$)";
   $files = array();
	 $curimage=0;
   if($handle = opendir($dirname)) {
       while(false !== ($file = readdir($handle))){
               if(eregi($pattern, $file)){
                     echo 'picsarray[' . $curimage .']="' . $file . '";';
                     $curimage++;
               }
       }

       closedir($handle);
   }
   return($files);
}

echo 'var locationstring="' . $locationstring . '";';
echo 'var picsarray=new Array();';
returnimages()
?> */
<?
$path =  $_GET['path'];

if($path){
	$files 		= array();
	$thumbsF 	= array();
	$imgDir 	= $path;
	$thumbDir 	= $imgDir.'\thumbs';
	
	if($imgDir && $thumbDir){
		$dir = opendir($path);
		$thumbs = opendir($thumbDir);

		/*$ext = substr($fileName, strrpos($fileName, '.') + 1);
		if(in_array($ext, array("jpg","jpeg","png","gif")){
			continue;
		}*/

		while($file = readdir($dir)) {
			if($file == '.' || $file == '..') {
				continue;
			}
			$files[] = $file;
		}
		while($thumb = readdir($thumbs)) {
			if($thumb == '.' || $thumb == '..') {
				continue;
			}
			$thumbsF[] = $thumb;
		}
		
		$returnFiles = array_merge($files,$thumbsF);
		
		header('Content-type: application/json');
		echo json_encode($returnFiles);
		
	}else{
		echo 'Sorry but the folders are not correct';	
	}
}
?>
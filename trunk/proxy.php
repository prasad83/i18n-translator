<?php
/**
 * YOU ARE FREE TO USE THIS FOR COMMERCIAL OR NON-COMMERCIAL PURPOSE.
 * PLEASE MAKE SURE TO RETAIN THE COPYRIGHT NOTICE AND PROVIDE CREDITS
 * TO ORIGINAL AUTHOR WHEREVER APPLICABLE.
 * AUTHOR: Prasad.A (http://code.google.com/p/i18n-translator)
 */
include_once dirname(__FILE__) . '/proxy/HTTP_Client.php';

class Proxy {
	
	function process($request) {
		if (get_magic_quotes_gpc()) {
			$request = $this->stripslashes_recursive($request);
		}		
		$client = new HTTP_Client($_REQUEST['url']);
		echo $client->doPost($request['params'], false);
	}
	
	protected function stripslashes_recursive($value) {
		$value = is_array($value) ? array_map(array($this, 'stripslashes_recursive'), $value) : stripslashes($value);
		return $value;
	}
}

$proxy = new Proxy();
$proxy->process($_REQUEST);

?>

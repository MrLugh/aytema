<?php

Class Content extends AppModel {

	public static function factory($network, array $params = null) {

		try {

			$class = $network."content";
			return new $class ($params);

		} catch(Exeption $e) {

		}

	}

	public static function factoryDs($network, array $params = null) {

		try {

			$class = $network."ContentDs";
			return new $class ($params);

		} catch(Exeption $e) {

		}

	}

	

}
// using System;
using System;
using System.Collections.Generic;
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour {

	float a = 3;
	uint b = 4;
	// Use this for initialization
	void Start () {
		Debug.Log("cao");
		Debug.Log("cao");
		Debug.Log(a);
		Debug.Log("cao");
		Debug.Log("cao");
	}
	
	// Update is called once per frame
	void Update () {
		a++;
		if(a>100){
			Debug.Log(a);
			a = 0;
		}
	}
}

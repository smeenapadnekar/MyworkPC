$(document).ready(function(){
	//run inject 
	const exec = require('child_process').exec;
	const child1 = exec('evt-tool',
    (error, stderr) => {
        
		console.log(`stderr: ${stderr}`);
		$('<div class="Err">'+stderr+'</div>').appendTo('#err-disp');
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
	});

	//wait for injecter to start
	setTimeout(function(){document.getElementById("Connect").disabled = false;},3000);


	$('#Connect').unbind().click(function(){
		//$("#PMDdisp").empty();
		//$("#SBCdisp").empty();
		//$("#Sensordisp").empty(); 
		//check if any device is testing
		var pmd=0;
		var sbc=0;
		var sensor=0;

		var n;
		var count=0;
		var device=Buffer.alloc(2);
		var pmdtype=0;
		var sbctype=0;
		var sensortype=0;

		//packet creation
		var StartConn=Buffer.from([0x01,0x01,0xff]);
		//start device packet
		var StartSBC=Buffer.from([0x02,0x01,0x01]);
		var StartPMD=Buffer.from([0x02,0x01,0x02]);
		var StartSensor=Buffer.from([0x02,0x01,0x03]);
		var StartSBC5=Buffer.from([0x02,0x01,0x04]);
		//end packets
		var StopSBC=Buffer.from([0x03,0x01,0x01]);
		var StopPMD=Buffer.from([0x03,0x01,0x02]);
		var StopSensor=Buffer.from([0x03,0x01,0x03]);
		//port on/off packets
		var d_type=Buffer.alloc(2);

		d_type.writeInt16BE(2000);
		
		var On1=Buffer.from([0x04,0x03,0x01]);
		var OFF1=Buffer.from([0x04,0x03,0x02]);
		var On2=Buffer.from([0x04,0x03,0x03]);
		var OFF2=Buffer.from([0x04,0x03,0x04]);
		var On3=Buffer.from([0x04,0x03,0x05]);
		var OFF3=Buffer.from([0x04,0x03,0x06]);
		var On4=Buffer.from([0x04,0x03,0x07]);
		var OFF4=Buffer.from([0x04,0x03,0x08]);

		var Onport1=Buffer.concat([On1,d_type]);
		var OFFport1=Buffer.concat([OFF1,d_type]);
		var Onport2=Buffer.concat([On2,d_type]);
		var OFFport2=Buffer.concat([OFF2,d_type]);
		var Onport3=Buffer.concat([On3,d_type]);
		var OFFport3=Buffer.concat([OFF3,d_type]);
		var Onport4=Buffer.concat([On4,d_type]);
		var OFFport4=Buffer.concat([OFF4,d_type]);
		
		//const port=document.getElementById("Port").value;
		const ip=document.getElementById("Ip").value;
		const UtoIport=document.getElementById("Portsend").value;
		const  ItoUport=document.getElementById("Portreceive").value;
	
	
		// const UtoIport=8080;
		// const ItoUport=8081;
		var net=require('net');

		//Sending Socket
		var UtoI;
		UtoI=new net.Socket();
		UtoI.connect(UtoIport,ip,function(){

			var x=document.getElementById("device");
			x.style.display="block";

			var y=document.getElementById("err-disp");
			y.style.display="none";

			var y=document.getElementById("Clear");
			y.style.display="block";

			console.log('connected to port \n '+UtoIport);

			UtoI.write(StartConn);

			$('#PMDStart').unbind().click(function(){

				if(pmdtype!=0){
					
					//check if any other is on;
					if(sbc==1){	
						UtoI.write(StopSBC); 
						$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Stopped'+'</div>').appendTo('#SBCdisp');
						sbc=0;
					}
					if(sensor==1){	
						UtoI.write(StopSensor);
						$('<div class="Sensor-Stop" style="color: red;font:bold;">Sensor Test Stopped'+'</div>').appendTo('#SensorDisp');
						sensor=0;
					}
					if(pmd==0){
						UtoI.write(StartPMD);
						$('<div class="PMD-Working" style="color: red;font:bold;">PMD Test Started'+'</div>').appendTo('#PMDdisp');
					}	
					pmd=1;
					$('#port0').unbind().click(function(){
						port2o();
						port3o();
						port4o();
						var p1stat=document.getElementById("port0");
						if(p1stat.checked==true)
							if(pmd==1){	
								UtoI.write(Onport1);
								console.log('port1');

							}
							else{
								console.log('port 1 on else');
								p1stat.checked=false;
							}
						else
							if(pmd==1){
								UtoI.write(OFFport1)	
							}
							else{
								p1stat.checked=true;
							}	

					});
					$('#port1').unbind().click(function(){
						port1o();
						port3o();
						port4o();
						var p2stat=document.getElementById("port1");
						if(p2stat.checked==true)
							if(pmd==1){
								UtoI.write(Onport2);
								console.log('port2');
							}
							else{
								p2stat.checked=false;
								var t=document.getElementById("slider");
								t.style.position="absolute";
							}	
						else
							if(pmd==1){
								UtoI.write(OFFport2)
							}
							else{
								p2stat.checked=true;
							}		

					});
					$('#port2').unbind().click(function(){
						console.log('clicked port3');
						port1o();
						port2o();
						port4o();
						var p3stat=document.getElementById("port2");
						if(p3stat.checked==true)
							if(pmd==1){
								UtoI.write(Onport3);
								console.log('port3');
							}
							else{
								p3stat.checked=false;
							}	
						else
							if(pmd==1){
								UtoI.write(OFFport3);
							}
							else{
								p3stat.checked=true;
							}	
					});
					$('#port3').unbind().click(function(){
						port1o();
						port2o();
						port3o();
						var p4stat=document.getElementById("port3");
						if(p4stat.checked==true)
							if(pmd==1){
								UtoI.write(Onport4);
								console.log('port4');
							}
							else{
								p4stat.checked=false;
							}
						else
							if(pmd==1){
								UtoI.write(OFFport4)	
							}
							else{
								p4stat.checked=false;
							}	

					});	
				
					$('#PMDStop').click(function(){
						if(pmd==1){
							port1o();
							port2o();
							port3o();
							port4o();
							UtoI.write(StopPMD);
							$('<div class="PMD-Stop" style="color: red;font:bolder;">PMD Test Stopped'+'</div>').appendTo('#PMDdisp');
							pmd=0;
						}	
					});
				}		
			});
			$('#SensorStart').unbind().click(function(){
				if(sensortype!=0){
					if(pmd===1){
							port1o();
							port2o();
							port3o();
							port4o();
						UtoI.write(StopPMD); 
						$('<div class="PMD-Stop" style="color: red;font:bold;">PMD Test Stopped'+'</div>').appendTo('#PMDdisp');
						pmd=0;
						}
					if(sbc===1){
						UtoI.write(StopSBC); 
						$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Stopped'+'</div>').appendTo('#SBCdisp');
						sbc=0;
					}
					if(sensor==0){
						UtoI.write(StartSensor);
						$('<div class="Sensor-Working" style="color: red;font:bold;">Sensor Test Started'+'</div>').appendTo('#SensorDisp');
					}	
					sensor=1;
					$('#SensorStop').unbind().click(function(){
						if(sensor==1){
							UtoI.write(StopSensor);
							$('<div class="Sensor-Stop" style="color: red;font:bold;">Sensor Test Stopped'+'</div>').appendTo('#SensorDisp');
							sensor=0;
						}	
					});
				}
			});
			$('#SBCStart').unbind().click(function(){
				if(pmd==1){
					port1o();
					port2o();
							port3o();
							port4o();
					UtoI.write(StopPMD);
					$('<div class="PMD-Stop" style="color: red;font:bold;">PMD Test Stopped'+'</div>').appendTo('#PMDdisp');
					pmd=0;
				}
				
				if(sensor==1){
					UtoI.write(StopSensor);
					$('<div class="Sensor-Stop" style="color: red;font:bold;">Sensor Test Stopped'+'</div>').appendTo('#SensorDisp');
					sensor=0;
				}

				var z=document.getElementById("check");
				if(z.checked==true){
					UtoI.write(StartSBC5);
					var z=document.getElementById("dot");
					z.style.backgroundColor = "#FF0000";
					$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Started(5 GHz)'+'</div>').appendTo('#SBCdisp');
					sbc=1;
					count=0;
				}	
				else{
					UtoI.write(StartSBC);
					var z=document.getElementById("dot");
						z.style.backgroundColor = "#FF0000";
					$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Started(2.4 GHz)'+'</div>').appendTo('#SBCdisp');
					sbc=1;
					count=0;
				}		

				$('#SBCStop').unbind().click(function(){
					if(sbc==1){
						UtoI.write(StopSBC);
						var z=document.getElementById("dot");
						z.style.backgroundColor = "#FF0000";
						$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Stopped'+'</div>').appendTo('#SBCdisp');
						sbc=0;
					}	
				});
			});

			$('#check').click(function(){
				if(sbc==1){
					var z=document.getElementById("check");
					if(z.checked==true){
						UtoI.write(StartSBC5);
						var z=document.getElementById("dot");
						z.style.backgroundColor = "#FF0000";
						$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Started(5 GHz)'+'</div>').appendTo('#SBCdisp');
						sbc=1;
						count=0;
					}	
					else{
						UtoI.write(StartSBC);
						var z=document.getElementById("dot");
						z.style.backgroundColor = "#FF0000";
						$('<div class="SBC-Stop" style="color: red;font:bold;">SBC Test Started (2.4 GHz)'+'</div>').appendTo('#SBCdisp');
						sbc=1;
						count=0;
					}	
				}
			});

			$('#Clear').click(function(){
				$("#PMDdisp").empty();
				$("#SBCdisp").empty();
				$("#SensorDisp").empty(); 
			});
		});
		

		//Receiving Socket
		var ItoU;

		ItoU=new net.Socket();
		ItoU.connect(ItoUport,ip,function(){
			console.log('connected to port 8081  ');
			
		});

		ItoU.on('data',(data)=>{
			//received date processing
			
			console.log(data[0]+ ' '+ data[1]+' '+ data[2]+' '+ data[3]+' '+ data[4]+' '+data[5]+' '+ data[6]+' '+data[7]+' '+data[8]+' '+data[9]+' '+data[10]+' '+data[11]);
			switch(data[0])
			{
				
				case 0x01: 	n=data[1]/2;
							console.log(n);
							// var y=document.getElementById('SBCtab');
							// y.style.display="none";
							// var y=document.getElementById('PMDtab');
							// y.style.display="none";
							// var y=document.getElementById('Sensortab');
							// y.style.display="none";			

							for(var i=0;i<n;i++)
							{
								device= data.readInt16BE(2+i*2)
								console.log(device);
								if(device===1000)
								{
									var y=document.getElementById('SBCtab');
									y.style.display="block";
									sbctype=device;

								}	
								else if(device===2000)	
								{
									pmdtype=device;
									var y=document.getElementById('PMDtab');
									y.style.display="block";
									
								}	
								else if(device===3000)
								{
									sensortype=device;
									var y=document.getElementById('Sensortab');
									y.style.display="block";	
								}	
	
							}
							break;
				case 0x02:	var len=data[1];
							if(data[2]==0x01){
								//disp to sbc
								if(len==1)
									$('<div class="Pact-Err">SBC Start Successfull'+'</div>').appendTo('#SBCdisp');
								else if(len==2)	
									$('<div class="Pact-Err">SBC Start Failed'+'</div>').appendTo('#SBCdisp');
							}
							else if(data[2]==0x02){
								//disp to pmd
								if(len==1)
									$('<div class="Pact-Err">PMD Start Successfull'+'</div>').appendTo('#PMDdisp');
								else if(len==2)	{
									$('<div class="Pact-Err">PMD Start Failed'+'</div>').appendTo('#PMDdisp');
									pmd=0;
								}
							}
							// else if(data[2]==0x03){
							// 	//disp to sensor
							// 	if(len==1)
							// 		$('<div class="Pact-Err">Sensor Start Successfull'+'</div>').appendTo('#SensorDisp');
							// 	else if(len==2)	{
							// 		$('<div class="Pact-Err">Sensor Start Failed'+'</div>').appendTo('#SensorDisp');
							// 		sensor=0;
							// 	}
							// }
							else if(data[2]==0x04){
								//disp to sbc
								if(len==1)
									$('<div class="Pact-Err">SBC Start Successful'+'</div>').appendTo('#SBCdisp');
								else if(len==2)
									$('<div class="Pact-Err">SBC  Start Failed'+'</div>').appendTo('#SBCdisp');	
							}
							break;		
						
				// case 0x03:	var len=data[1];
				// 			if(data[2]==0x01){
				// 				//disp to sbc
				// 				if(len==1)
				// 					$('<div class="Pact-Err">SBC Stop Successfull'+'</div>').appendTo('#SBCdisp');
				// 				else if(len==2){
				// 					$('<div class="Pact-Err">SBC Stop Failed'+'</div>').appendTo('#SBCdisp');
				// 					//sbc=1;
				// 				}	
				// 			}
				// 			else if(data[2]==0x02){
				// 				//disp to pmd
				// 				if(len==1)
				// 					$('<div class="Pact-Err">PMD Stop Successfull'+'</div>').appendTo('#PMDdisp');
				// 				else if(len==2)	{
				// 					$('<div class="Pact-Err">PMD Stop Failed'+'</div>').appendTo('#PMDdisp');
				// 					//pmd=1;
				// 				}	
				// 			}
				// 			else if(data[2]==0x03){
				// 				//disp to sensor
				// 				if(len==1)
				// 					$('<div class="Pact-Err">Snesor Stop Successfull'+'</div>').appendTo('#SnesorDisp');
				// 				else if(len==2){
				// 					$('<div class="Pact-Err">Snesor Stop Failed'+'</div>').appendTo('#SnesorDisp');
				// 					//sensor=1;
				// 				}	
				// 			}
				// 			else if(data[2]==0x04){
				// 				//disp to sbc
				// 				if(len==1)
				// 					$('<div class="Pact-Err">SBC Stop Successful'+'</div>').appendTo('#SBCdisp');
				// 				else if(len==2){
				// 					$('<div class="Pact-Err">SBC  Stop Failed'+'</div>').appendTo('#SBCdisp');
				// 					//sbc=1;
				// 				}		
				// 			}
				// 			break;					
							
				case 0x04: 	var opid=data[2];
							
							if(data[3]===0xff)
							{
								//packet resent cases
								switch(opid){
									case 0x01:	//UtoI.write(Onport1);
												var p1stat=document.getElementById("port0");
												p1stat.checked=false;
												$('<div class="Pact-Err">Port 1 ON :Error in packet  '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x02:	//UtoI.write(OFFport1);
												var p1stat=document.getElementById("port0");
												p1stat.checked=true;
												$('<div class="pmd-power">Port 1 OFF : Error in Packet '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x03:	//UtoI.write(Onport2);
												var p2stat=document.getElementById("port1");
												p2stat.checked=false;
												$('<div class="Pact-Err">Port 2 ON :Error in packet '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x04:	//UtoI.write(OFFport2)
												var p2stat=document.getElementById("port1");
												p2stat.checked=true;
												$('<div class="Pact-Err">Port 2 OFF :Error in packet '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x05:  //UtoI.write(Onport3);
												var p3stat=document.getElementById("port2");
												p3stat.checked=false;
												$('<div class="Pact-Err">Port 3 ON :Error in packet '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x06:	//UtoI.write(OFFport3)
												var p3stat=document.getElementById("port2");
												p3stat.checked=true;
												$('<div class="Pact-Err">Port 3 OFF :Error in packet  '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x07:	//UtoI.write(Onport4);
												var p4stat=document.getElementById("port3");
												p4stat.checked=false;
												$('<div class="Pact-Err">Port 4 ON :Error in packet '+'</div>').appendTo('#PMDdisp');
												break;
									case 0x08: 	//UtoI.write(OFFport4);
												var p4stat=document.getElementById("port3");
												p4stat.checked=true;
												$('<div class="Pact-Err">Port 4 OFF :Error in packet '+'</div>').appendTo('#PMDdisp');
												break;
									default: break;	//write into display		
								}
							}
							else{
								//data packets
								var length=parseInt(data[1],16);
								var d='';
								for(var i=0;i<length-1;i++)
									d+=' '+data[3+i];
								switch(opid)
								{
									case 0x09:	$('<div class="pmd-power">Power Data : Port-'+data[3]+' Power-'+data[4]+'</div>').appendTo('#PMDdisp');
												//display to pmd
												break;
									case 0x0a:	$('<div class="pmd-temp">Temperature Data : '+data[3]+' <sup>o</sup>C'+'</div>').appendTo('#PMDdisp');	
												//to pmd
												break;
									case 0x0b:	$('<div class="sensor-temp"> Temperature Data : '+d+'<sup>o</sup>C</div>').appendTo('#SensorDisp');  
												//to sensor
												break;
									case 0x0c:	$('<div class="sensor-humid">Humidity Data : '+d+'</div>').appendTo('#SensorDisp');
												//to sensor
												break;
									case 0x0d:	$('<div class="sensor-RFID">RFID Data : '+d+'</div>').appendTo('#SensorDisp');
												//to sensor
												break;
									case 0x0e:	$('<div class="sensor-PIR">PIR Data : '+d+'</div>').appendTo('#SensorDisp');	
												//to sensor
												break;
									case 0x0f:	$('<div class="sbc-wifi">WIFI Data : '+d+'</div>').appendTo('#SBCdisp');
												var z=document.getElementById("dot");
												z.style.backgroundColor = "#48fb47";
												//to sbc
												break;
									case 0x10:	count+=1;
												if(count===1){
													$('<div class="sbc-temp"> Temperature Data (BLE): '+d+'<sup>o</sup>C'+'</div>').appendTo('#SBCdisp');
												}
												else if(count===3)
													count=0;
													//to sbc
												break;
									// case 0x11:	if(data[3]===1)
									// 					$('<div class="port-stat">Port 1 On'+'</div>').appendTo('#PMDdisp');
									// 			else
									// 					$('<div class="port-stat">Port 1 Off'+'</div>').appendTo('#PMDdisp');
									// 			break;
									// case 0x12:	if(data[3]===1)		
									// 				$('<div class="port-stat">Port 2 On'+'</div>').appendTo('#PMDdisp');
									// 			else
									// 				$('<div class="port-stat">Port 2 Off'+'</div>').appendTo('#PMDdisp');
									// 			break;
									// case 0x13:	if(data[3]===1)
									// 					$('<div class="port-stat">Port 3 On'+'</div>').appendTo('#PMDdisp');
									// 			else
									// 					$('<div class="port-stat">Port 3 Off'+'</div>').appendTo('#PMDdisp');
									// 			break;
									// case 0x14:	if(data[3]===1)
									// 					$('<div class="port-stat">Port 4 On'+'</div>').appendTo('#PMDdisp');
									// 			else
									// 					$('<div class="port-stat">Port 4 Off'+'</div>').appendTo('#PMDdisp');
									// 			break;		
									case 0x11:	if(data[3]==1)
													$('<div class="port-stat">Port 1 On'+'</div>').appendTo('#PMDdisp');
									 			else
									 				$('<div class="port-stat">Port 1 Off'+'</div>').appendTo('#PMDdisp');
												if(data[4]==1)
												 	$('<div class="port-stat">Port 2 On'+'</div>').appendTo('#PMDdisp');
									 			else
													 $('<div class="port-stat">Port 2 Off'+'</div>').appendTo('#PMDdisp');
												
												if(data[5]==1)
												 	$('<div class="port-stat">Port 3 On'+'</div>').appendTo('#PMDdisp');
									 			else
													 $('<div class="port-stat">Port 3 Off'+'</div>').appendTo('#PMDdisp');
													 
												if(data[6]==1)
												 	$('<div class="port-stat">Port 4 On'+'</div>').appendTo('#PMDdisp');
									 			else
									 				$('<div class="port-stat">Port 4 Off'+'</div>').appendTo('#PMDdisp');	 
																								
									default: break;			
								}
							}	

			}
		});
		UtoI.on('close',function(){
			console.log('Connection closed');
			var x=document.getElementById("device");
			x.style.display="none";
			var y=document.getElementById("err-disp");
			y.style.display="block";
		});

		UtoI.on('error',function(Error){
			console.log('error in '+ItoUport,Error.toString());
			$('<div class="Err">'+Error.toString()+'</div>').appendTo('#err-disp');
		});
		ItoU.on('error',function(Error){
			console.log('Error'+UtoIport+Error.toString());
		
			$('<div class="Err">'+Error.toString()+'</div>').appendTo('#err-disp');
		});

	});
});

function port1o(){
	var u=document.getElementById("port0");
	if(u.checked==true)
		u.checked=false;
}

function port2o(){
	var u=document.getElementById("port1");
	if(u.checked==true)
		u.checked=false;
}

function port3o(){
	var u=document.getElementById("port2");
	if(u.checked==true)
		u.checked=false;
}

function port4o(){
	var u=document.getElementById("port3");
	if(u.checked==true)
		u.checked=false;
}
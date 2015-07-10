/* Generated by AN DISI Unibo */ 
/*
JavaScript allows us to handle the moves 
as first class functions and to change the moves
* ==================================================================
	USER DEFINED PLANS
* ==================================================================
*/
var halt = [
"(Stop,0,0, '', 0)"
];
var prog = [
"(Forward,80,1000, usercmd->halt, 0)",
"(Backward,80,1000, alarm->halt, 0)",
"(Stop,0,0, '', 0)"
];
/*
* ==================================================================
*  INTERPRETER
* ==================================================================
*/
// -------------- THIS IS FOR Nashhorn (Java 8) ---------------
var robotKbClass = Java.type('it.unibo.robotActor.utils.RobotSysKb');
var robot 		 = robotKbClass.robotActor;
// -------------- END Nashhorn (Java 8) ---------------
/*
------------------------------------------------
HLMOVE
An 'object' that represents tha high level move
HLMOVE = 
"(NAME,  SPEED , TIME,   EVENT -> PLAN, ANGLE )"
resumePlan
repeatPlan N
------------------------------------------------
*/
function HlRobotMove(HLMOVE){
	if( HLMOVE.indexOf("resumePlan") > 0 ) return;
	if( HLMOVE.indexOf("repeatPlan") > 0 ) {
		var mm = HLMOVE.split(",");
		this.cmd 		= mm[0].split('(')[1];
		this.numOfIter 	= mm[1].split(')')[0];
		return;
	};
	var mm = HLMOVE.split(",");
	this.cmd 		= mm[0].split('(')[1];
	this.speed 		= mm[1];
	this.time 		= mm[2];		
	if( mm[4] != undefined ) 	
		this.angle 	= mm[4].split(')')[0];
	else 
		this.angle 	= -2;
	var eventPart 	= mm[3].split(')')[0];
	var eventCond   = eventPart.split("->");
	this.eventId 	= eventCond[0];
	this.plan		= eventCond[1];
}
var testHlRobotMove = function(){
var x = new HlRobotMove("(Forward,  40 , 6000,   lineDetected -> recoveryPlan, 90  )");
println( " ++++  " + x.cmd );
println( " ++++  " + x.speed );
println( " ++++  " + x.time );
println( " ++++  " + x.eventId );
println( " ++++  " + x.plan );
println( " ++++  " + x.angle );
}
//testHlRobotMove();
/*
==================================================
	ENTRY
==================================================
*/ 
var moveRobot = function() {
 	moveRobotCustomProg( prog,1,false  );	
	return "robot prog done";
}
 
/*
==================================================
	ROBOT PROGRAM AS A USER DEFINED PLAN
==================================================
*/
var moveRobotCustomProg = function( p,  n ) {
var repeating = false;
	for( var i=0; i<p.length;i++){
		println( ' 		!!! moveRobotCustomProg ========= '  + p.length + " " + p[i] );		 
		if( p[i].indexOf("resumePlan") >= 0 ){
		 	return 1;
 		}
  		if( p[i].indexOf("repeatPlan") >= 0 ){
 			var numOfIter = new HlRobotMove( p[i] ).numOfIter;
  			//println( ' 		!!! %%%%%%%%% moveRobotCustomProg n='  + n + " iter=" +  numOfIter );
			repeating = (n <= numOfIter) ;
 		}else{
		   var res = doRobotMove( p[i] );
 		   //println( ' 		!!! moveRobotCustomProg '  + p.length + " " + i + " res=" + res);
 		   if( res == -1 ){	//superStop
 		   		repeating = false;
 		   		break;
 		   }
 		}
 	}
 	//println( ' 		!!! moveRobotCustomProg '  + p.length + " n=" + n + " repeating=" + repeating);
  	if( repeating )
  		 return moveRobotCustomProg( p,n+1  );
  	else
 	 return 0;
}
var doRobotMove = function( HLMOVE ){
//HLMOVE ... (Forward,  40 , 6000, angle ,  lineDetected -> recoveryPlan  )
//MOVE ... execute(Forward,  40 , 6000,  angle,  lineDetected )
	//println( ' 		!!! doRobotMove --------- HLMOVE= '  + HLMOVE.indexOf("resumePlan") );
 	//Sets the robot.execute args
	var hlm = new HlRobotMove(HLMOVE);
	//println( ' 		!!! doRobotMove ...... for '  + hlm.cmd  );
	var res = robot.execute(hlm.cmd , hlm.speed,hlm.angle,hlm.time ,  hlm.eventId);
	println( ' 		!!! doRobotMove ...... for '  + hlm.cmd + " res=" + res);
	if( res == -1 ){//plan interrupted
		return -1;
	}	
	if( res > 0 ){
 		var PLAN = hlm.plan;
		if( PLAN != undefined && PLAN.length>1){ 
 			var resumePlan =  moveRobotCustomProg( eval(PLAN) );
 			if( resumePlan == 1 ){
 				resumePreviousPlan(HLMOVE,res);
			}else return -1;
		}
	}else
		return 0;
} 
var resumePreviousPlan = function(HLMOVE,dt){
	println( ' 		!!! doRobotMove RESUMES === ' + HLMOVE + " with dt= " + dt);
	var newMove = buildRestOfMove(HLMOVE,dt);
	doRobotMove( newMove );
}
var buildRestOfMove = function(MOVE,NEWTIME){
 	var m1 = MOVE.split(",")
 	m1[2] = NEWTIME;
	//print( ' 		!!! buildRestOfMove  .............. m1= ' + m1);
 	return m1.toString();
}
//==============================================
println = function( msg ){
	print(msg+"\n");
}
println(" !!! JavaScript interpreter STARTED");

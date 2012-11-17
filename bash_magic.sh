#!/bin/bash

desc[0]="Elapsed real (wall clock) time used by the process "
desc[1]="Average total (data+stack+text) memory use of the process"
desc[2]="Maximum resident set size of the process during its lifetime"
desc[3]="Percentage of the CPU that this job got. (user + system times divided by the total running time)"
desc[4]="Total number of CPU-seconds used by the system on behalf of the process (in kernel mode)"
desc[5]="Total number of CPU-seconds that the process used directly (in user mode):"
desc[6]="Average resident set size of the process:"

iterations=1000

values_acum=(0 0 0 0 0 0 0)
declare -a values_curr
#Iteramos..
for i in `seq 1 $iterations`;
do
  res=`/usr/bin/time -f "%e|%K|%M|%P|%S|%U|%t" $1 2>&1`
  
  values_ret=($(echo $res | tr "|" "\n"))

  unset values_ret[0]
  
  let cont=0
  for val in "${values_ret[@]}"
  do
    #Sacamos el punto
    values_curr[$cont]=$val
    #Sacamos el %
    values_curr[$cont]=${values_curr[$cont]/\%}
    values_acum[$cont]=$(echo "scale=10; ${values_acum[$cont]} + ${values_curr[$cont]}" | bc -l)

    #Sumamos uno al contador
    let cont++
  done
done

#devolvemos los valores
let cont=0
for val in "${values_acum[@]}"
  do
    prom=$(echo "scale=4; $val/$iterations" | bc -l)
    echo "${desc[$cont]} = $prom"
    
    #Sumamos uno al contador
    let cont++
  done

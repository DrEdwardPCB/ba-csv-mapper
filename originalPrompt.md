I want to create a frontend application to assist data mapping for Business Analyst.

The Design will be having 3 panel Left Right Bottom

Left Panel is the source

Right Panel is the target

Bottom Panel is the mapped

Left and Right Panel allows user to upload CSV file after upload it will display on a mui x premium data grid. Once user clicks on the row on Left or right panel it will open a pop up modal showing a multiselect and have search capability on data grid allow user to map source to target or target to source. If modal is initiate from source row, it will display the target row. Once all mapping row is selected user click done and it will update the mapped data grid and highlight both left or right to say it is mapped.

For the mapped it will initially be full outer join of source and target. There will be one more extra column called remarks to allow user to add remarks which is pinned on right
it also has a pinned right colum for action unmap to removd the mapped column

the mapped also have a download excel function provided by mui x datagrid

so the example is like below

source 
Name, Type, Haha
XXX,string,
yyy,number

target
Name,Type,Hehe
xxx,string
zzz,number

Original mapping display
source_name, source_type, source_Haha, target_Name, target_Type,target_Hehe,Remarks
XXX,string,,,,,
yyy,number,,,,,
,,,xxx,string,,
,,,zzz,number,,

say XXX maps to xxx

result mapped display
source_name, source_type, source_Haha, target_Name, target_Type,target_Hehe,Remarks
XXX,string,,xxx,string,,
yyy,number,,,,,
,,,zzz,number,,

complex situation multi map field

source 
Name, Type, Haha
XXX,string,
yyy,number

target
Name,Type,Hehe
xxx,string
zzz,number

Original mapping display
source_name, source_type, source_Haha, target_Name, target_Type,target_Hehe,Remarks
XXX,string,,,,,
yyy,number,,,,,
,,,xxx,string,,
,,,zzz,number,,

say XXX maps to xxx and zzz

result mapped display
source_name, source_type, source_Haha, target_Name, target_Type,target_Hehe,Remarks
XXX,string,,xxx,string,,
XXX,string,,zzz,number,,
yyy,number,,,,,

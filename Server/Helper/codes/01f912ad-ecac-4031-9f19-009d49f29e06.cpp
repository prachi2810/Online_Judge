#include <iostream> 
using namespace std;
int main() { 
    int n;
    cin>>n;
    while(n>0){
        if(n%2==0){
        n/=2;
        }
    }
    if(n==0){
        cout<<"YES";
    }
    else{
        cout<<"NO";
    }
    return 0;  
}
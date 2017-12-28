#define USE_NORMALMAP
#define USE_SOFTSHADOW

float SpecularPow = 2;
float SpecularScale = 0.25;
float HalfLambParam = 1.0;
float RimPow	= 4.0;
float EmmisiveParam = 0;
float ShadowParam = 0.5;

float3 FillLight = 1*float3(200,190,180)/255.0;
float3 BackLight = 0.8*float3(100,100,100)/255.0;
float3 RimLight = float3(150,150,150)/255.0;
float3 ExLight =  float3(120,110,100)/255.0;
float3 SkyColor = float3(0.9f, 0.9f, 1.0f)*1;
float3 GroundColor = float3(0.1f, 0.05f, 0.0f)*1;
float MapParam = 8;

#define SHADOWMAP_SIZE 1024
float SoftShadowParam = 0.5;
float4x4 HeadMat : CONTROLOBJECT < string name = "(self)"; string item = "頭"; >;

float4x4 WorldViewProjMatrix      : WORLDVIEWPROJECTION;
float4x4 WorldMatrix              : WORLD;
float4x4 ViewMatrix               : VIEW;
float4x4 LightWorldViewProjMatrix : WORLDVIEWPROJECTION < string Object = "Light"; >;

float3   LightDirection    : DIRECTION < string Object = "Light"; >;
float3   CameraPosition    : POSITION  < string Object = "Camera"; >;

float4   MaterialDiffuse   : DIFFUSE  < string Object = "Geometry"; >;
float3   MaterialAmbient   : AMBIENT  < string Object = "Geometry"; >;
float3   MaterialEmmisive  : EMISSIVE < string Object = "Geometry"; >;
float3   MaterialSpecular  : SPECULAR < string Object = "Geometry"; >;
float    SpecularPower     : SPECULARPOWER < string Object = "Geometry"; >;
float3   MaterialToon      : TOONCOLOR;
float4   EdgeColor         : EDGECOLOR;
float4   EgColor;

float3   LightDiffuse      : DIFFUSE   < string Object = "Light"; >;
float3   LightAmbient      : AMBIENT   < string Object = "Light"; >;
float3   LightSpecular     : SPECULAR  < string Object = "Light"; >;
static float4 DiffuseColor  = MaterialDiffuse  * float4(LightDiffuse, 1.0f);
static float3 AmbientColor  = saturate(MaterialAmbient * LightAmbient);
static float3 SpecularColor = MaterialSpecular * LightSpecular;

bool     parthf;
bool     transp;
bool	 spadd;
#define SKII1    1500
#define SKII2    8000
#define Toon     3

float4 ClearColor = {0,0,0,0};
float ClearDepth  = 1.0;

texture NormalTex : RenderColorTarget
<
    float2 ViewPortRatio = {1.0,1.0};
    string Format = "D3DFMT_A16B16G16R16F" ;
>;
sampler NormalSampler = sampler_state {
    texture = <NormalTex>;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};
texture2D DepthBuffer : RENDERDEPTHSTENCILTARGET <
    float2 ViewPortRatio = {1.0,1.0};
    string Format = "D24S8";
>;


texture ObjectTexture: MATERIALTEXTURE;
#define ANISO_NUM 16
sampler ObjTexSampler = sampler_state {
    texture = <ObjectTexture>;
	MINFILTER = ANISOTROPIC;
	MAGFILTER = ANISOTROPIC;
	MIPFILTER = ANISOTROPIC;
	
	MAXANISOTROPY = ANISO_NUM;
};

texture ObjectSphereMap: MATERIALSPHEREMAP;
sampler ObjSphareSampler = sampler_state {
    texture = <ObjectSphereMap>;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

texture2D NormalMap <
    string ResourceName = "fmap.png";
>;
sampler NormalMapSamp = sampler_state {
    texture = <NormalMap>;
	MINFILTER = ANISOTROPIC;
	MAGFILTER = ANISOTROPIC;
	MIPFILTER = ANISOTROPIC;
	
	MAXANISOTROPY = ANISO_NUM;
};

sampler MMDSamp0 : register(s0);
sampler MMDSamp1 : register(s1);
sampler MMDSamp2 : register(s2);

float4 ColorRender_VS(float4 Pos : POSITION) : POSITION 
{
    return mul( Pos, WorldViewProjMatrix );
}

float4 ColorRender_PS() : COLOR
{
    return EdgeColor;
}

technique EdgeTec < string MMDPass = "edge"; > {
    pass DrawEdge {
        AlphaBlendEnable = FALSE;
        AlphaTestEnable  = FALSE;

        VertexShader = compile vs_3_0 ColorRender_VS();
        PixelShader  = compile ps_3_0 ColorRender_PS();
    }
}

float4 Shadow_VS(float4 Pos : POSITION) : POSITION
{
    return mul( Pos, WorldViewProjMatrix );
}

float4 Shadow_PS() : COLOR
{
    return float4(AmbientColor.rgb, 0.65f);
}

technique ShadowTec < string MMDPass = "shadow"; > {
    pass DrawShadow {
        VertexShader = compile vs_3_0 Shadow_VS();
        PixelShader  = compile ps_3_0 Shadow_PS();
    }
}

struct VS_ZValuePlot_OUTPUT {
    float4 Pos : POSITION;
    float4 ShadowMapTex : TEXCOORD0;
};

VS_ZValuePlot_OUTPUT ZValuePlot_VS( float4 Pos : POSITION,float2 Tex : TEXCOORD0 )
{
    VS_ZValuePlot_OUTPUT Out = (VS_ZValuePlot_OUTPUT)0;

    Out.Pos = mul( Pos, LightWorldViewProjMatrix );

    Out.ShadowMapTex = Out.Pos;

    return Out;
}

float4 ZValuePlot_PS( float4 ShadowMapTex : TEXCOORD0 ) : COLOR
{
    return float4(ShadowMapTex.z/ShadowMapTex.w,0,0,1);
}

technique ZplotTec < string MMDPass = "zplot"; > {
    pass ZValuePlot {
        AlphaBlendEnable = FALSE;
        VertexShader = compile vs_3_0 ZValuePlot_VS();
        PixelShader  = compile ps_3_0 ZValuePlot_PS();
    }
}

sampler DefSampler : register(s0);

struct BufferShadow_OUTPUT {
    float4 Pos      : POSITION;
    float4 ZCalcTex : TEXCOORD0;
    float2 Tex      : TEXCOORD1;
    float3 Normal   : TEXCOORD2;
    float3 Eye      : TEXCOORD3;
    float2 SpTex    : TEXCOORD4;
    float4 WorldPos      : TEXCOORD5;
    float4 Color    : COLOR0;
    float4 LocalPos		: TEXCOORD6;
    float4 LastPos	: TEXCOORD7;
};

BufferShadow_OUTPUT BufferShadow_VS(float4 Pos : POSITION, float3 Normal : NORMAL, float2 Tex : TEXCOORD0, uniform bool useTexture, uniform bool useSphereMap, uniform bool useShadow)
{
    BufferShadow_OUTPUT Out = (BufferShadow_OUTPUT)0;
	Out.LocalPos = Pos;
	Out.WorldPos = mul( Pos, WorldMatrix );
    Out.Pos = mul( Pos, WorldViewProjMatrix );
    
    Out.Eye = CameraPosition - mul( Pos, WorldMatrix );
    Out.Normal = normalize( mul( Normal, (float3x3)WorldMatrix ) );
    Out.ZCalcTex = mul( Pos, LightWorldViewProjMatrix );
    
    Out.Color.rgb = AmbientColor;

    Out.Color.a = DiffuseColor.a;
    Out.Color = saturate( Out.Color );
    
    Out.Tex = Tex;
    Out.LastPos = Out.Pos;
    
    if ( useSphereMap ) {
        float2 NormalWV = mul( Out.Normal, (float3x3)ViewMatrix );
        Out.SpTex.x = NormalWV.x * 0.5f + 0.5f;
        Out.SpTex.y = NormalWV.y * -0.5f + 0.5f;
    }
    
    return Out;
}
float3x3 compute_tangent_frame(float3 Normal, float3 View, float2 UV)
{
  float3 dp1 = ddx(View);
  float3 dp2 = ddy(View);
  float2 duv1 = ddx(UV);
  float2 duv2 = ddy(UV);

  float3x3 M = float3x3(dp1, dp2, cross(dp1, dp2));
  float2x3 inverseM = float2x3(cross(M[1], M[2]), cross(M[2], M[0]));
  float3 Tangent = mul(float2(duv1.x, duv2.x), inverseM);
  float3 Binormal = mul(float2(duv1.y, duv2.y), inverseM);

  return float3x3(normalize(Tangent), normalize(Binormal), Normal);
}

float4 CalcNormal(float2 Tex,float3 Eye,float3 Normal, bool useTexture)
{
	#ifndef USE_NORMALMAP
		return float4(Normal,1);
	#endif
	float4 Norm = 1;

    float2 tex = Tex* MapParam;
	float4 Color;
	float3 normal;
	
	float4 NormalColor = tex2D( NormalMapSamp, tex)*2;	

	NormalColor = NormalColor.rgba;
	NormalColor.a = 1;
	float3x3 tangentFrame = compute_tangent_frame(Normal, Eye, Tex);
	Norm.rgb = normalize(mul(NormalColor - 1.0f, tangentFrame));

	return Norm;
}

inline float CalcBeckman(float m, float cosbeta)
{
	return (
		exp(-(1-(cosbeta*cosbeta))/(m*m*cosbeta*cosbeta))
		/(4*m*m*cosbeta*cosbeta*cosbeta*cosbeta)
		);
}

inline float CalcFresnel(float n, float c)
{
	float g = sqrt(n*n + c*c - 1);
	float T1 = ((g-c)*(g-c))/((g+c)*(g+c));
	float T2 = 1 + ( (c*(g+c)-1)*(c*(g+c)-1) )/( (c*(g-c)+1)*(c*(g-c)+1) );
	return 0.5 * T1 * T2;
}

inline float3 CalcSpecular(float3 L,float3 N,float3 V,float3 Col)
{
	float3 H = normalize(L + V);

	float3 Specular = pow( max(0,dot( H, normalize(N) )), (1)) * (Col);
    return Specular;

	float NV = dot(N, V);
	float NH = dot(N, H);
	float VH = dot(V, H);
	float NL = dot(N, L);

	float D = CalcBeckman(0.35f, NH);
	float G = min(1, min(2*NH*NV/VH, 2*NH*NL/VH));
	float F = CalcFresnel(20.0f, dot(L, H));
	return max(0, F*D*G/NV)*1 * Col;
}

float4 BufferShadow_PS(BufferShadow_OUTPUT IN, uniform bool useTexture, uniform bool useSphereMap, uniform bool useShadow) : COLOR
{
	float3 HeadVec = -normalize(HeadMat[2]);
	float2 ScrTex;
    ScrTex.x = (IN.LastPos.x / IN.LastPos.w)*0.5+0.5;
	ScrTex.y = (-IN.LastPos.y / IN.LastPos.w)*0.5+0.5;
	
	IN.Normal = CalcNormal(IN.Tex,normalize(IN.Eye),normalize(IN.Normal),useTexture).rgb;
	IN.Normal = normalize(IN.Normal);
		
    float3 normal = IN.Normal;
	float3 Eye = normalize(IN.Eye);
	float2 tex = IN.Tex;
    
    float comp = 1;
    if(useShadow)
    {
	    // テクスチャ座標に変換
	    IN.ZCalcTex /= IN.ZCalcTex.w;
	    float2 TransTexCoord;
	    TransTexCoord.x = (1.0f + IN.ZCalcTex.x)*0.5f;
	    TransTexCoord.y = (1.0f - IN.ZCalcTex.y)*0.5f;
	    if( any( saturate(TransTexCoord) == TransTexCoord ) ) {
	    	comp = 0;
	    	float zcol = tex2D(DefSampler,TransTexCoord).r;
			float U = SoftShadowParam / SHADOWMAP_SIZE;
			float V = SoftShadowParam / SHADOWMAP_SIZE;
			#ifndef USE_SOFTSHADOW
		        if(parthf) {
		            float Skill = SKII2*TransTexCoord.y;
		            comp=1-saturate(max(IN.ZCalcTex.z-zcol , 0.0f)*Skill-0.3f);
		        } else {
		            float Skill = SKII1-0.3f;
		            comp=1-saturate(max(IN.ZCalcTex.z-zcol , 0.0f)*Skill-0.3f);
		        }
			#else
		        if(parthf) {
		            float Skill = SKII2*TransTexCoord.y-0.3f;
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,-V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,-V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,-V)).r , 0.0f)*Skill-0.3f);
		        } else {
		            float Skill = SKII1-0.3f;
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,0)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(0,-V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(-U,-V)).r , 0.0f)*Skill-0.3f);
			        comp += saturate(max(IN.ZCalcTex.z-tex2D(DefSampler,TransTexCoord+float2(U,-V)).r , 0.0f)*Skill-0.3f);
		        }
		        comp = 1-saturate(comp/9);
		    #endif
	    }
	    comp = lerp(1,comp,ShadowParam);
    }
    

    float4 Color = 1;
    Color.a = IN.Color.a;
	float half_mul = lerp(1,0.5,HalfLambParam);
	float half_add = lerp(0,0.5,HalfLambParam);
	
    AmbientColor.rgb = saturate(AmbientColor.rgb+MaterialEmmisive*EmmisiveParam);
	Color.rgb = comp*max(0,dot( normal, -LightDirection )*half_mul+half_add) * AmbientColor * LightAmbient * 2;
	Color.rgb += max(0,dot( normal, normalize(normalize(-Eye) ) )*half_mul+half_add) * AmbientColor * BackLight*2* LightAmbient * 2;
	Color.rgb += max(0,dot( normal, normalize(Eye) )*half_mul+half_add) * AmbientColor * FillLight*0.25* LightAmbient * 2;
	Color.rgb += max(0,dot( normal, HeadVec)*half_mul+half_add) * AmbientColor * LightAmbient * ExLight;
	
	float3 N = normal;
	float3 V = normalize(IN.Eye);
    float amount = (dot( normal, float3(0,1,0) )+1) * 0.5;
    float3 HalfSphereL = lerp( GroundColor, SkyColor, amount );
    Color.rgb += HalfSphereL*0.1;
    Color.rgb+=EmmisiveParam*AmbientColor;

    float3 Specular = 
    				pow(CalcSpecular(normalize(-LightDirection),N,V,1),SpecularPow)  * LightAmbient
    ;		 
    float anti_sp = 1;//tex2D( SpMapSamp, tex).r;

    Specular *= anti_sp*SpecularScale;
    //Specular = pow(Specular*1.5,8);
	//return float4(Specular,1);

	
    if ( useTexture ) {
	    float4 TexColor = tex2D( ObjTexSampler, IN.Tex );	
        Color *= TexColor;
    }else{
    	float4 TexColor = 1;
        Color *= TexColor;
    }
    if ( useSphereMap ) {
        float4 TexColor = tex2D(ObjSphareSampler,IN.SpTex);
        if(spadd) {
            Color.rgb += TexColor;
        } else {
            Color.rgb *= TexColor;
        }
    }
    Color.rgb += Specular;
    Color.rgb += pow(1-saturate(max(0,dot( normal, normalize(Eye) ) )),RimPow)*RimLight * LightAmbient;
    
    return Color;
}

technique MainTec4 < string MMDPass = "object"; bool UseTexture = false; bool UseSphereMap = false;> {
    pass DrawObject {
        VertexShader = compile vs_3_0 BufferShadow_VS(false, false, false);
        PixelShader  = compile ps_3_0 BufferShadow_PS(false, false, false);
    }
}

technique MainTec5 < string MMDPass = "object"; bool UseTexture = true; bool UseSphereMap = false;> {
    pass DrawObject {
        VertexShader = compile vs_3_0 BufferShadow_VS(true, false, false);
        PixelShader  = compile ps_3_0 BufferShadow_PS(true, false, false);
    }
}

technique MainTec6 < string MMDPass = "object"; bool UseTexture = false; bool UseSphereMap = true;> {
    pass DrawObject {
        VertexShader = compile vs_3_0 BufferShadow_VS(false, true, false);
        PixelShader  = compile ps_3_0 BufferShadow_PS(false, true, false);
    }
}

technique MainTec7 < string MMDPass = "object"; bool UseTexture = true; bool UseSphereMap = true;> {
    pass DrawObject {
        VertexShader = compile vs_3_0 BufferShadow_VS(true, true, false);
        PixelShader  = compile ps_3_0 BufferShadow_PS(true, true, false);
    }
}

technique MainTecBS4  < string MMDPass = "object_ss"; bool UseTexture = false; bool UseSphereMap = false;
    string Script = 
	    //最終合成
        "RenderColorTarget0=;"
	    "RenderDepthStencilTarget=;"
	    "Pass=DrawObject;"
    ;
> {
    pass DrawObject {
    	CULLMODE = NONE;
        VertexShader = compile vs_3_0 BufferShadow_VS(false, false, true);
        PixelShader  = compile ps_3_0 BufferShadow_PS(false, false, true);
    }
}

technique MainTecBS5  < string MMDPass = "object_ss"; bool UseTexture = true; bool UseSphereMap = false; 
    string Script = 
	    //最終合成
        "RenderColorTarget0=;"
	    "RenderDepthStencilTarget=;"
	    "Pass=DrawObject;"
    ;
> {
    pass DrawObject {
    	CULLMODE = NONE;
        VertexShader = compile vs_3_0 BufferShadow_VS(true, false, true);
        PixelShader  = compile ps_3_0 BufferShadow_PS(true, false, true);
    }
}

technique MainTecBS6  < string MMDPass = "object_ss"; bool UseTexture = false; bool UseSphereMap = true;
    string Script = 
        "RenderColorTarget0=;"
	    "RenderDepthStencilTarget=;"
	    "Pass=DrawObject;"
    ;
> {
    pass DrawObject {
    	CULLMODE = NONE;
        VertexShader = compile vs_3_0 BufferShadow_VS(false, true, true);
        PixelShader  = compile ps_3_0 BufferShadow_PS(false, true, true);
    }
}

technique MainTecBS7  < string MMDPass = "object_ss"; bool UseTexture = true; bool UseSphereMap = true;
    string Script = 
        "RenderColorTarget0=;"
	    "RenderDepthStencilTarget=;"
	    "Pass=DrawObject;"
    ;
> {
    pass DrawObject {
    	CULLMODE = NONE;
        VertexShader = compile vs_3_0 BufferShadow_VS(true, true, true);
        PixelShader  = compile ps_3_0 BufferShadow_PS(true, true, true);
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////

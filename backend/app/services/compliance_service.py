"""
Compliance Risk Analysis Service
Analyzes payroll data for compliance risks across different countries
"""

import logging
from typing import Dict, List, Any, Optional
from ..core.config import STANDARD_FIELDS
# from ..utils.llm_utils import get_compliance_analysis  # Not needed for basic analysis
from ..utils.mapping_utils import get_mapping_coverage_stats

logger = logging.getLogger(__name__)


class ComplianceAnalysisService:
    """Service for analyzing compliance risks across different countries"""

    # Compliance risk factors by country
    COUNTRY_RISK_FACTORS = {
        "Germany": {
            "tax_complexity": "high",
            "social_security": "complex",
            "data_protection": "GDPR strict",
            "labor_law": "comprehensive",
            "reporting_requirements": "extensive",
            "base_risk": "medium"
        },
        "France": {
            "tax_complexity": "high",
            "social_security": "complex",
            "data_protection": "GDPR strict", 
            "labor_law": "strict",
            "reporting_requirements": "extensive",
            "base_risk": "medium"
        },
        "United Kingdom": {
            "tax_complexity": "medium",
            "social_security": "moderate",
            "data_protection": "UK GDPR",
            "labor_law": "flexible",
            "reporting_requirements": "moderate",
            "base_risk": "low"
        },
        "Netherlands": {
            "tax_complexity": "medium",
            "social_security": "moderate",
            "data_protection": "GDPR strict",
            "labor_law": "balanced",
            "reporting_requirements": "moderate",
            "base_risk": "low"
        },
        "United States": {
            "tax_complexity": "high",
            "social_security": "federal + state",
            "data_protection": "state-specific",
            "labor_law": "state-specific",
            "reporting_requirements": "complex",
            "base_risk": "medium"
        },
        "Canada": {
            "tax_complexity": "medium",
            "social_security": "federal + provincial",
            "data_protection": "PIPEDA",
            "labor_law": "provincial",
            "reporting_requirements": "moderate",
            "base_risk": "low"
        },
        "Japan": {
            "tax_complexity": "high",
            "social_security": "complex",
            "data_protection": "APPI",
            "labor_law": "traditional",
            "reporting_requirements": "extensive",
            "base_risk": "medium"
        },
        "Australia": {
            "tax_complexity": "medium",
            "social_security": "superannuation",
            "data_protection": "Privacy Act",
            "labor_law": "fair work",
            "reporting_requirements": "moderate",
            "base_risk": "low"
        },
        "Singapore": {
            "tax_complexity": "low",
            "social_security": "CPF",
            "data_protection": "PDPA",
            "labor_law": "flexible",
            "reporting_requirements": "streamlined",
            "base_risk": "low"
        },
        "Switzerland": {
            "tax_complexity": "high",
            "social_security": "complex",
            "data_protection": "Swiss DPA",
            "labor_law": "cantonal",
            "reporting_requirements": "detailed",
            "base_risk": "medium"
        }
    }

    def __init__(self):
        """Initialize the compliance analysis service"""
        self.risk_factors = self.COUNTRY_RISK_FACTORS

    def analyze_compliance_risks(
        self, 
        headers: Optional[List[str]] = None, 
        rows: Optional[List[List[str]]] = None,
        mapping: Optional[Dict[str, str]] = None
    ) -> Dict[str, str]:
        """
        Analyze compliance risks for different countries
        
        Args:
            headers: CSV headers (optional)
            rows: CSV data rows (optional)
            mapping: Field mapping (optional)
            
        Returns:
            Dictionary mapping country names to risk assessments
        """
        compliance_heatmap = {}
        
        # Calculate data quality score if data is provided
        data_quality_score = 1.0  # Default to perfect
        if headers and mapping:
            coverage_stats = get_mapping_coverage_stats(mapping)
            data_quality_score = coverage_stats.get('coverage_percentage', 100) / 100
        
        # Analyze each country
        for country, risk_factors in self.risk_factors.items():
            risk_assessment = self._assess_country_risk(country, risk_factors, data_quality_score)
            compliance_heatmap[country] = risk_assessment
            
        return compliance_heatmap

    def _assess_country_risk(self, country: str, risk_factors: Dict[str, str], data_quality: float) -> str:
        """
        Assess risk for a specific country
        
        Args:
            country: Country name
            risk_factors: Risk factors for the country
            data_quality: Data quality score (0-1)
            
        Returns:
            Risk assessment string
        """
        base_risk = risk_factors.get("base_risk", "medium")
        
        # Calculate risk score (0-10 scale)
        risk_score = 0
        
        # Base risk contribution
        if base_risk == "low":
            risk_score += 2
        elif base_risk == "medium":
            risk_score += 5
        else:  # high
            risk_score += 8
            
        # Tax complexity
        tax_complexity = risk_factors.get("tax_complexity", "medium")
        if tax_complexity == "high":
            risk_score += 2
        elif tax_complexity == "medium":
            risk_score += 1
            
        # Data protection requirements
        data_protection = risk_factors.get("data_protection", "")
        if "GDPR" in data_protection:
            risk_score += 1.5
        elif "strict" in data_protection.lower():
            risk_score += 1
            
        # Labor law complexity
        labor_law = risk_factors.get("labor_law", "")
        if labor_law in ["comprehensive", "strict"]:
            risk_score += 1
            
        # Adjust for data quality
        if data_quality < 0.7:
            risk_score += 2  # Poor data quality increases risk
        elif data_quality < 0.9:
            risk_score += 1  # Moderate data quality adds some risk
            
        # Generate risk assessment based on score
        if risk_score <= 3:
            level = "Low Risk"
            details = self._get_low_risk_details(country, risk_factors)
        elif risk_score <= 6:
            level = "Moderate"
            details = self._get_moderate_risk_details(country, risk_factors)
        else:
            level = "High Risk"
            details = self._get_high_risk_details(country, risk_factors)
            
        return f"{level} - {details}"

    def _get_low_risk_details(self, country: str, risk_factors: Dict[str, str]) -> str:
        """Get details for low risk countries"""
        details = []
        
        if country == "Singapore":
            details.append("Streamlined tax system")
        elif country == "Netherlands":
            details.append("Well-structured compliance framework")
        elif country == "Canada":
            details.append("Clear federal/provincial structure")
        elif country == "Australia":
            details.append("Fair Work system provides clarity")
        elif country == "United Kingdom":
            details.append("Flexible employment laws")
        else:
            details.append("Manageable compliance requirements")
            
        # Add data protection note if applicable
        if "GDPR" in risk_factors.get("data_protection", ""):
            details.append("GDPR compliance required")
            
        return "; ".join(details) if details else "Standard compliance requirements"

    def _get_moderate_risk_details(self, country: str, risk_factors: Dict[str, str]) -> str:
        """Get details for moderate risk countries"""
        details = []
        
        if country == "Germany":
            details.append("Complex tax system")
        elif country == "France":
            details.append("Extensive labor regulations")
        elif country == "United States":
            details.append("Multi-state compliance complexity")
        elif country == "Japan":
            details.append("Traditional employment practices")
        elif country == "Switzerland":
            details.append("Cantonal variations")
        else:
            details.append("Multiple compliance areas need attention")
            
        # Common moderate risk factors
        tax_complexity = risk_factors.get("tax_complexity", "")
        if tax_complexity == "high":
            details.append("high tax complexity")
            
        return "; ".join(details) if details else "Several compliance considerations"

    def _get_high_risk_details(self, country: str, risk_factors: Dict[str, str]) -> str:
        """Get details for high risk countries"""
        details = []
        
        # High risk typically means multiple complex factors
        if country == "Germany":
            details.append("Shadow payroll requirements")
        elif country == "France":
            details.append("Strict labor code compliance")
        elif country == "United States":
            details.append("Federal and state complexity")
        elif country == "Japan":
            details.append("Detailed reporting requirements")
        else:
            details.append("Multiple high-complexity factors")
            
        # Add specific risk factors
        if risk_factors.get("social_security") == "complex":
            details.append("complex social security")
        if "extensive" in risk_factors.get("reporting_requirements", ""):
            details.append("extensive reporting")
            
        return "; ".join(details) if details else "Immediate attention required"

    def get_country_details(self, country: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific country's compliance requirements
        
        Args:
            country: Country name
            
        Returns:
            Dictionary with detailed country information
        """
        if country not in self.risk_factors:
            return {"error": f"Country '{country}' not found in risk database"}
            
        risk_factors = self.risk_factors[country]
        
        return {
            "country": country,
            "risk_factors": risk_factors,
            "assessment": self._assess_country_risk(country, risk_factors, 1.0),
            "recommendations": self._get_country_recommendations(country, risk_factors)
        }
    
    def _get_country_recommendations(self, country: str, risk_factors: Dict[str, str]) -> List[str]:
        """Get recommendations for a specific country"""
        recommendations = []
        
        # Tax complexity recommendations
        if risk_factors.get("tax_complexity") == "high":
            recommendations.append("Engage local tax expertise")
            recommendations.append("Implement robust tax calculation system")
            
        # Data protection recommendations
        data_protection = risk_factors.get("data_protection", "")
        if "GDPR" in data_protection:
            recommendations.append("Ensure GDPR compliance for employee data")
            recommendations.append("Implement data subject rights procedures")
        elif data_protection:
            recommendations.append(f"Comply with {data_protection} requirements")
            
        # Labor law recommendations
        labor_law = risk_factors.get("labor_law", "")
        if labor_law in ["comprehensive", "strict"]:
            recommendations.append("Review employment contracts with local counsel")
            recommendations.append("Stay updated on labor law changes")
            
        # Reporting recommendations
        reporting = risk_factors.get("reporting_requirements", "")
        if reporting == "extensive":
            recommendations.append("Establish comprehensive reporting procedures")
            recommendations.append("Consider local payroll provider")
            
        # Default recommendations
        if not recommendations:
            recommendations.append("Monitor regulatory changes")
            recommendations.append("Maintain accurate employee records")
            
        return recommendations 